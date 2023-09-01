(() => {
  var webpackModules = {
    "./src/title.js": (unusedWebpackModule, exports) => {
      var count = 0;
      // 这里就是直接把0放上去了 你再去改count也没有用
      exports.count = count;
      exports.add = function () {
        count++;
      };
    }
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = {};
  (() => {
    var _require = webpackRequire("./src/title.js"),
        count = _require.count,
        add = _require.add;
    console.log(count);
    add();
    console.log(count);
  })();
})();