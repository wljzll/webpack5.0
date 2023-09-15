let fs = require("fs");
let path = require('path');
let readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法

let PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
    path: result[1],
    query: result[2],
    fragment: result[3],
  };
}

/**
 * 
 * @param {*} request loader的绝对路径
 * @returns 
 */
function createLoaderObject(request) {
  let loaderObj = {
    path: "", // loader的绝对路径
    query: "", // loader路径中的查询字符串
    fragment: "", // loader路径中的query
    normal: null, // loader函数本身
    pitch: null, // pitch函数本身
    raw: false, // 是否需要转成字符串，默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过
    normalExecuted: false, // normal函数是否已经执行过了
  };
  
  // 定义request属性
  Object.defineProperty(loaderObj, "request", {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment;
    },
    set(request) {
      let splittedResource = parsePathQueryFragment(request);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    },
  });
  // 设置request属性
  loaderObj.request = request; // c:/src/index.js?name=zhufeng#top
  // 加载loader获取normal函数
  let normal = require(loaderObj.path);
  // 给loader对像设置normal属性
  loaderObj.normal = normal;
  // 设置pitch属性
  loaderObj.pitch = normal.pitch;
  // 设置raw属性
  loaderObj.raw = normal.raw;
  // 返回loader对象
  return loaderObj;
}

function processResource(processOptions, loaderContext, finalCallback) {
  loaderContext.loaderIndex = loaderContext.loaderIndex - 1; // 索引等于最后一个loader的索引
  let resourcePath = loaderContext.resourcePath;
  
  loaderContext.readResource(resourcePath, (err, resourceBuffer) => {
    if (err) finalCallback(err);
    processOptions.resourceBuffer = resourceBuffer; // 放的是资源的原始内容
    interateNormalLoaders(processOptions, loaderContext, [resourceBuffer], finalCallback)
  })
}

function interateNormalLoaders(processOptions, loaderContext, args, finalCallback) {
  if (loaderContext.loaderIndex < 0) { // 如果索引已经小于0了，说明所有的normal都已经执行完了
    return finalCallback(null, args)
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex = loaderContext.loaderIndex - 1;
    return interateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      finalCallback
    );
  }
  let normalFunction = currentLoaderObject.normal;
  currentLoaderObject.normalExecuted = true; // 表示pitch函数已经执行过了
  convertArgs(args, currentLoaderObject.raw);
  runSyncOrAsync(normalFunction, loaderContext, args, (err, ...values) => {
    if (err) finalCallback(err);
    interateNormalLoaders(processOptions, loaderContext, values, finalCallback)
  })
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) { // 想要Buffer，但不是Buffer，转成Buffer
    args[0] = Buffer.from(args[0])
  } else if (!raw && Buffer.isBuffer(args[0])) { // 不想要Buffer，但是是Buffer，转成字符串
    args[0] = args[0].toString('utf-8');
  }
}

/**
 * 执行loader的pitch方法
 * @param {*} processOptions
 * @param {*} loaderContext loader里的this，就是所谓的上下文对象loaderContext
 * @param {*} finalCallback loader全部执行完会执行此回调
 */
function interatePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 如果从左到右已经执行到最后一个loader的pitch了 则开始从右到左执行loader的normal
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finalCallback)
  }
  // 获取当前的loader
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  
  // 如果当前索引的loader的pitch已经执行过了 则索引++ 递归执行下一个
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++;
    return interatePitchingLoaders(
      processOptions,
      loaderContext,
      finalCallback
    );
  }

  // 获取loader的pitch
  let pitchFunction = currentLoaderObject.pitch;
  currentLoaderObject.pitchExecuted = true; // 表示pitch函数已经执行过了
  if (!pitchFunction) {
    // 如果此loader没有pitch方法
    return interatePitchingLoaders(
      processOptions,
      loaderContext,
      finalCallback
    );
  }
  // 同步或异步执行pitch 这取决于loader的pitch如何调用回调函数
  runSyncOrAsync(
    pitchFunction,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...values) => {
      // 如果有返回值 (pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕) 掉头去执行上一个loader的normal
      if (values.length > 0 && !!values[0]) {
        loaderContext.loaderIndex--; // 索引减一，回到上一个loader，执行上一个loader的normal方法
        interateNormalLoaders(processOptions, loaderContext, values, finalCallback)
      } else {
        interatePitchingLoaders(processOptions, loaderContext, finalCallback)
      }
    }
  );
}

/**
 * 
 * @param {*} fn pitch或normal函数
 * @param {*} context 上线文
 * @param {*} args 参数
 * @param {*} callback pitch/normal执行完后执行的回调函数
 * @returns 
 */
function runSyncOrAsync(fn, context, args, callback) {
  let isSync = true; // 是否同步 默认是同步
  let isDone = false; // 是否fn已经执行完成 默认是false
  // 当前loader的pitch/normal执行完成后 可以调用这个回调函数
  const innerCallback = (context.callback = function (err, ...values) {
    isDone = true;
    isSync = false;
    callback(err, ...values);
  });

  // 提供异步调用方式让loader的pitch/normal方法调用
  context.async = function () {
    isSync = false; // 把同步标志设置为false 意思就是改为异步
    return innerCallback;
  };

  // pitch的返回值可有可无
  let result = fn.apply(context, args);
  // console.log(args[0], fn, result, '======')

  // 执行完loader的pitch 还是同步的话就直接调用回调函数
  if (isSync) {
    isDone = true; // 直接完成
    return callback(null, result); // 调用回调
  }
}

/**
 * 
 * @param {*} options 配置项, 包括: 
 *  要加载和转换的资源: resource;
 *  loader的绝对路径数组:loaders;
 *  额外的loader上下文: context: { name: '珠峰' }; 
 *  读取文件的方法:readResource: fs.readFile.bind(fs)
 * @param {*} callback 运行完成后的回调函数
 */
function runLoaders(options, callback) {
  let resource = options.resource || ""; // 要加载的资源 c:/src/index.js?name=zhufeng#top
  let loaders = options.loaders || []; // loader的绝对路径的数组

  let loaderContext = options.context || {}; // 这个是一个对象，它将会成为loader函数执行时候的上下文

  let readResource = options.readResource || readFile; // 读取文件的方法
  let splittedResource = parsePathQueryFragment(resource); // c:/src/index.js?name=zhufeng#top 用正则去匹配query和hash

  let resourcePath = splittedResource.path; // c:/src/index.js
  let resourceQuery = splittedResource.query; // name=zhufeng
  let resourceFragment = splittedResource.fragment; // #top
  let contextDirectory = path.dirname(resourcePath); // 需要加载的资源所在的目录
  
  //  遍历loader 把每个loader路径 转成一个对象 最终组成一个数组
  let loaderObject = loaders.map(createLoaderObject);
  // 构造每个loader的上下文
  loaderContext.context = contextDirectory; // 's/Desktop/project/webpack5.0/第3节 webpack工作流/lesson28/src'
  loaderContext.resourcePath = resourcePath;// c:/src/index.js
  loaderContext.resourceQuery = resourceQuery;// name=zhufeng
  loaderContext.resourceFragment = resourceFragment; // #top
  loaderContext.readResource = readResource; // 读取文件的方法
  loaderContext.loaderIndex = 0; // 它是一个指标，就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loaderObject; // 存放一个个loader对象的数组
  loaderContext.callback = null;
  loaderContext.async = null;

  // 要加载的资源=> c:/src/index.js?name=zhufeng#top 不包含loader
  Object.defineProperty(loaderContext, "resource", {
    get() {
      return (
        loaderContext.resourcePath +
        loaderContext.resourceQuery +
        loaderContext.resourceFragment
      );
    },
  });

  // 所有的loader加上resouce => 包含loader loader1.js!loader2.js!loader3.js!c:/src/index.js?name=zhufeng#top
  Object.defineProperty(loaderContext, "request", {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .map((l) => l.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 这样做是为了动态获取 剩下的请求 loader2.js!loader3.js!c:/src/index.js?name=zhufeng#top
  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 当前的请求 loader1.js!c:/src/index.js?name=zhufeng#top
  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 之前的请求 loader1.js!loader2.js!c:/src/index.js?name=zhufeng#top
  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 当前loader的query
  Object.defineProperty(loaderContext, "query", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    },
  });

  // 当前loader的data
  Object.defineProperty(loaderContext, "data", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    },
  });
  
  // 构造对象
  let processOptions = {
    resourceBuffer: null,
    readResource, // 读取文件的方法
  };

  // 开始执行loader
  interatePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(null, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

exports.runLoaders = runLoaders;
