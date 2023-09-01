(() => {
  "use strict";
  var modules = {
    "./src/title.js": (module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        "age": () => age,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const __WEBPACK_DEFAULT_EXPORT__ = 'title_name';
      var age = 'title_age';
    }
  };

  var cache = {};
  /**
   * 
   * @param {*} moduleId 模块id
   * @returns 
   */
  function require(moduleId) {
    // 缓存中是否有
    var cachedModule = cache[moduleId];
    // 有
    if (cachedModule !== undefined) {
      // 取出来
      return cachedModule.exports;
    }
    // 没有 放到缓存 定义一个exports
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }

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
    require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
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
    var title = require("./src/title.js");
    console.log(title["default"]);
    console.log(title.age);
  })();
})();