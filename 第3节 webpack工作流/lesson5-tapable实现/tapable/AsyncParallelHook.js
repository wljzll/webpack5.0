let Hook = require("./Hook");
// 生成call方法的工厂函数
const HookCodeFactory = require("./HookCodeFactory");

// 继承HookCodeFactory
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsParallel({ onDone });
  }
}

// 创建异步并行Hook工厂实例
let factory = new AsyncParallelHookCodeFactory();

// 继承Hook类 声明异步并行钩子类
class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;

/** 编译结果
(function anonymous(name, age, _callback) {
  var _x = this._x;
  var _counter = 3;
  var _done = function () {
    _callback();
  };
  var _fn0 = _x[0];
  _fn0(name, age, function (_err0) {
    if (--_counter === 0) _done();
  });
  var _fn1 = _x[1];
  _fn1(name, age, function (_err1) {
    if (--_counter === 0) _done();
  });
  var _fn2 = _x[2];
  _fn2(name, age, function (_err2) {
    if (--_counter === 0) _done();
  });
});
 */
