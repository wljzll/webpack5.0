(() => {
  var modules = {
    "./src/title.js": module => {
      module.exports = {
        name: 'title_name',
        age: 'title_age'
      };
    }
  };

  var cache = {};
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

  (() => {
    require.n = module => {
      var getter = module && module.__esModule ? () => module['default'] : () => module;
      require.d(getter, {
        a: getter
      });
      return getter;
    };
  })();

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
    var title_default = require.n(title);
    console.log(title_default());
    console.log(title.age);
  })();
})();