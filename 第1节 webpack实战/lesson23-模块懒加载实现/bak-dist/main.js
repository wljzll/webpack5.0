(() => {
  // 当前顶级作用域的全局变量用来实现模块兼容
  var modules = {};
  // 缓存模块
  var cache = {};
  // 自己实现的require方法
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  // 将modules赋值给require.m
  require.m = modules;
  // 定义require.d方法
  (() => {
    require.d = (exports, definition) => {
      for (var key in definition) {
        if (require.o(definition, key) && !require.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    require.f = {};
    // 第二步：require.e()方法
    require.e = chunkId => {
      // Object.keys(require.f).reduce()处理require.f给Promise.all()添加成员
      return Promise.all(Object.keys(require.f).reduce((promises, key) => {
        // require.f只有一个j属性 调用require.f.j
        require.f[key](chunkId, promises);
        return promises;
      }, []));
    };
  })();

  (() => {
    require.u = chunkId => {
      return "" + chunkId + ".main.js";
    };
  })();

  (() => {
    require.g = function () {
      if (typeof globalThis === 'object') return globalThis;
      try {
        return this || new Function('return this')();
      } catch (e) {
        if (typeof window === 'object') return window;
      }
    }();
  })();

  (() => {
    require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  (() => {
    var inProgress = {};
    var dataWebpackPrefix = "lesson1:";
    require.l = (url, done, key, chunkId) => {
      if (inProgress[url]) {
        inProgress[url].push(done);
        return;
      }
      var script, needAttach;
      if (key !== undefined) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i];
          if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) {
            script = s;
            break;
          }
        }
      }
      if (!script) {
        needAttach = true;
        script = document.createElement('script');
        script.charset = 'utf-8';
        script.timeout = 120;
        if (require.nc) {
          script.setAttribute("nonce", require.nc);
        }
        script.setAttribute("data-webpack", dataWebpackPrefix + key);
        script.src = url;
      }
      inProgress[url] = [done];
      var onScriptComplete = (prev, event) => {
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var doneFns = inProgress[url];
        delete inProgress[url];
        script.parentNode && script.parentNode.removeChild(script);
        doneFns && doneFns.forEach(fn => fn(event));
        if (prev) return prev(event);
      };
      var timeout = setTimeout(onScriptComplete.bind(null, undefined, {
        type: 'timeout',
        target: script
      }), 120000);
      script.onerror = onScriptComplete.bind(null, script.onerror);
      script.onload = onScriptComplete.bind(null, script.onload);
      needAttach && document.head.appendChild(script);
    };
  })();

  (() => {
    require.r = exports => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, '__esModule', {
        value: true
      });
    };
  })();

  (() => {
    var scriptUrl;
    if (require.g.importScripts) scriptUrl = require.g.location + "";
    var document = require.g.document;
    if (!scriptUrl && document) {
      if (document.currentScript) scriptUrl = document.currentScript.src;
      if (!scriptUrl) {
        var scripts = document.getElementsByTagName("script");
        if (scripts.length) scriptUrl = scripts[scripts.length - 1].src;
      }
    }
    if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
    require.p = scriptUrl;
  })();

  (() => {
    // 加载完成的chunk
    var installedChunks = {
      "main": 0 // 0表示加载完成
    };
    // 第三步: chunkId: src_video_js
    require.f.j = (chunkId, promises) => {
      // require.o 判断installedChunks是否有chunkId对应的属性
      var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
      // 如果已经加载过
      if (installedChunkData !== 0) {
        if (installedChunkData) {
          // 给promises push installedChunkData[2]
          promises.push(installedChunkData[2]);
        } else { // 没有加载过
          if (true) { // true没有意义
            // 创建一个promise 给installedChunkData 和 installedChunks[chunkId赋值一个数组 这个promise等待resolve reject
            var promise = new Promise((resolve, reject) => installedChunkData = installedChunks[chunkId] = [resolve, reject]);
            // installedChunkData = [resolve, reject, promise] 并将这个promise追加到promises数组中
            promises.push(installedChunkData[2] = promise);
            // require.p获取的当前服务的地址 require.u是负责拼接出当前chunk的完整路径 src_video_js + main.js
            var url = require.p + require.u(chunkId); // http://127.0.0.1:8080/src_video_js.main.js
            var error = new Error();
            // 定义一个loadingEnded事件
            var loadingEnded = event => {
              if (require.o(installedChunks, chunkId)) {
                installedChunkData = installedChunks[chunkId];
                if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
                if (installedChunkData) {
                  var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                  var realSrc = event && event.target && event.target.src;
                  error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                  error.name = 'ChunkLoadError';
                  error.type = errorType;
                  error.request = realSrc;
                  installedChunkData[1](error);
                }
              }
            };
            require.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
          } else installedChunks[chunkId] = 0;
        }
      }
    };
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
      var [chunkIds, moreModules, runtime] = data;
      var moduleId,
        chunkId,
        i = 0;
      if (chunkIds.some(id => installedChunks[id] !== 0)) {
        for (moduleId in moreModules) {
          if (require.o(moreModules, moduleId)) {
            require.m[moduleId] = moreModules[moduleId];
          }
        }
        if (runtime) var result = runtime(require);
      }
      if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (require.o(installedChunks, chunkId) && installedChunks[chunkId]) {
          installedChunks[chunkId][0]();
        }
        installedChunks[chunkId] = 0;
      }
    };
    var chunkLoadingGlobal = self["webpackChunklesson1"] = self["webpackChunklesson1"] || [];
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    // 重写push方法
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
  })();
  
  var __webpack_exports__ = {};
  var playButton = document.getElementById('play');
  playButton.addEventListener('click', function () {
    // 第一步：调用require.e方法加载(src_video_js)
    require.e("src_video_js").then(require.bind(require, "./src/video.js")).then(function (result) {
      console.log(result);
    });
  });
})();