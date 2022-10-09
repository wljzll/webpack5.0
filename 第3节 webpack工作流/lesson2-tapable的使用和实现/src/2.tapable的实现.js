// let { SyncHook } = require('tapable');
// console.log(SyncHook);

// 所以一个SyncHook实例如果注册了多个事件 我们执行一次call会把所有的注册事件回调都调用一次
class SyncHook {
    constructor(_args) {
        // 收集创建实例时传递了几个参数
        this._args = _args;
        // 收集这个实例注册的事件
        this.taps = [];
    }
    // 调用tap注册事件 name没有意义  fn是call事件时要执行的回调
    tap(name, fn) {
        // 收集回调
        this.taps.push(fn);
    }
    // 通知事件执行
    call() {
        // 调用call方法时可能会传递多个参数 但是创建实例时可能规定了参数个数 当call传递的参数大于创建实例时 需要截取
        let args = Array.prototype.slice.call(arguments, 0, this._args.length);
        // 遍历注册的所有事件 依次执行回调 依次传入参数
        this.taps.forEach(tap => tap(...args));
    }
}

// 创建SyncHook实例
let hook = new SyncHook(['name']);
// 注册一个事件
hook.tap('click', (name) => {
    console.log('clicked', name);
})
// 触发事件
hook.call('zhufeng');