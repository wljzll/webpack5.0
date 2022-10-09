(() => {
  // webpack编译title.js后的代码
  var modules = {
    './src/title.js': (module) => {
      module.exports = 'title';
    }
  }
  
  // 用来缓存模块
  var cache = {};
  /**
   * @description webpack自己实现的commonjs规范
   * @param {*} moduleId 模块ID
   * @returns 模块导出的值
   */
  function require(moduleId) {
    // 先判断是否已缓存 已缓存拿到缓存返回
    if(cache[moduleId]) {
      return cache[moduleId].exports;
    }
    
    // 每次调用require方法都会定义一个module = {exports: {}}
    var module = cache[moduleId] = {
      exports: {}
    }
    
    // modules[moduleID]: 模块对应的函数 module.exports: 每次定义的module对象 require: webpack自己实现的require方法
    modules[moduleId].call(module.exports, module, module.exports, require);
    // 返回对应的值
    return module.exports;
  }

  // webpack编译index.js后的代码
  (() => {
    var title = require("./src/title.js");
    console.log(title);
  })();
})();