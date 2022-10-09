// 存放所有的模块定义 key: 模块ID value: 模块定义
var modules = {};
// 已经加载的模块的缓存
var cache = {};

function require(moduleId) {
  if (cache[moduleId]) {
    return cache[moduleId];
  } else {
    var module = cache[moduleId] = { exports: {} };
    // 执行模块定义方法 给module.exports赋值 导出对象就是module.exports
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
}

require.m = modules; // 模块定义赋值给m
require.c = cache; // 模块缓存赋值给c
require.f = {};
require.p = 'http://127.0.0.1:8081/';
// 给模块添加ESModule标识
require.r = exports => {
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
  });
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
}
// 给模块定义getter
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key]
    });
  }
};
require.u = (chunkId) => chunkId + '.main.js';
require.l = (url) => {
  let script = document.createElement('script');
  script.src = url;
  document.head.append(script);
}

// 已经安装好/正在加载中的代码块
var installedChunks = {
  main: 0, // 0表示已经安装好
}

require.f.j = (chunkId, promises) => {
  var installedChunkData;
  var promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  })

  promises.push(installedChunkData[2] = promise);
  var url = require.p + require.u(chunkId); // 这个是JSONP要加载的脚本的路径
  require.l(url);
}

require.e = (chunkId) => {
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
}
var webpackJsonpCallback = ([chunkIds, moreModules]) => {
  var moduleId, chunkId, i = 0, resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    // 把promise的resolve方法取出放到resolves数组中
    resolves.push(installedChunks[chunkId][0]);
  }
  
  // 把模块定义合并到全局的modules上
  for (let moduleId in moreModules) {
    require.m[moduleId] = moreModules[moduleId];
  }

  while (resolves.length) {
    // 取出每个resolve执行
    resolves.shift()();
  }
}

// 定义一个代码块加载的全局变量 默认值是一个空数组
var chunkLoadingGlobal = window["webpackChunklesson1"] = [];
chunkLoadingGlobal.push = webpackJsonpCallback;

var playButton = document.getElementById('play');
playButton.addEventListener('click', function () {
  // ./src/video.js => [src, video, js].join('_') 模块ID如何生成
  require.e("src_video_js").then(require.bind(require, "./src/video.js")).then(function (result) {
    console.log(result.default);
  });
});