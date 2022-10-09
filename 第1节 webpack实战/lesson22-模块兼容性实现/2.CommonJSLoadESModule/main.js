// 不管源码是commonJs还是ESModule 最后webpack把他们都编译成了commonJs规范
(() => {
  // webpack编译title.js后的代码 ESModule编译成这样
  var modules = {
    './src/title.js': (module, exports, require) => {
      require.r(exports);
      // 给exports的default和age属性添加两个getter
      require.d(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age,
      })

      const DEFAULT_EXPORT = 'title_name';
      const age = 'title_age';
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
    if (cache[moduleId]) {
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

  /**
   * @description 将definition定义成getter
   * @param {*} exports require方法中定义的module的exports属性 
   * @param {*} definition webpack编译后定义的get格式的对象
   */
  require.d = (exports, definition) => {
    for (let key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      })
    }
  }

  // 这个方法的目的是给exports添加一个标识和修改内部值
  require.r = (exports) => {
    // console.log(Object.prototype.toString(exports)) => [object Module]
    // 修改exports的Object.prototype.toString(exports)的返回值
    Object.defineProperties(exports, Symbol.toStringTag, { value: 'Module' });
    // 给exports添加个_esModule属性
    Object.defineProperty(exports, '_esModule', { value: true });

  }

  // webpack编译index.js后的代码
  (() => {
    var title = require("./src/title.js");
    console.log(title);
    console.log(title.age);
  })();
})();