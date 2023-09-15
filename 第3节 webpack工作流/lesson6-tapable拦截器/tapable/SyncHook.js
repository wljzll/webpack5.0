let Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

// 2、从HookCode工厂继承并创建同步HookCode工厂类
class SyncHookCodeFactory extends HookCodeFactory {
  content() {
    // 调用父类的方法
    return this.callTapsSeries();
  }
}

// 3、创建factory实例
let factory = new SyncHookCodeFactory();

// 1、继承Hook类
class SyncHook extends Hook {
  compile(options) {
    // 调用编译call方法的工厂类的setup方法设置属性
    factory.setup(this, options);
    // 返回创建的call方法
    return factory.create(options);
  }
}
module.exports = SyncHook;

/** 要动态编译出的函数
(function anonymous(name, age) {
    var _x = this._x;
    var _fn0 = _x[0];
    _fn0(name, age);
    var _fn1 = _x[1];
    _fn1(name, age);
})
*/
