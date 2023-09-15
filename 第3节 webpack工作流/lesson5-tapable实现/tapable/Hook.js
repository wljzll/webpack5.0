/**
 * Hook类只是用来保存注册的事件信息以及发起call方法的编译
 */
class Hook {
  // 创建实例时传入形参数组
  constructor(args) {
    // 参数不是数组转成数组
    if (!Array.isArray(args)) args = [];
    // 保存到实例上
    this.args = args;
    // 所有注册的事件组成的对象
    this.taps = [];
    // 给call方法赋值 第一次调用call方法就是调用这个
    this.call = CALL_DELEGATE;
    // 异步call方法赋值
    this.callAsync = CALL_ASYNC_DELEGATE;
    // 给promise方法赋值
    this.promise = PROMISE_DELEGATE;
  }
  // 调用tap同步注册事件
  tap(options, fn) {
    this._tap("sync", options, fn);
  }
  // tapAsync异步注册
  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }
  // promise注册
  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }

  // 保存事件信息
  _tap(type, options, fn) {
    // 如果注册时的参数是string 就是事件名
    if (typeof options === "string") {
      options = { name: options };
    }
    // 注册的事件信息
    let tapInfo = { ...options, type, fn };
    // 将事件信息对象保存到实例上
    this._insert(tapInfo);
  }
  // 这个方法的意义在于: call一次之后再次tap要再次去编译
  _resetCompilation() {
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
  }
  // 保存注册的事件相关信息
  _insert(tapInfo) {
    // 给call方法重新赋值
    this._resetCompilation();
    // 收集事件信息
    this.taps.push(tapInfo);
  }
  // compile方法应该由各个子类实现
  compile(options) {
    throw new Error("Abstract: should be overridden");
  }
  _createCall(type) {
    // 调用子类的compile方法 动态编译
    return this.compile({
      taps: this.taps,
      args: this.args,
      type,
    });
  }
}

// 同步调用call方法
const CALL_DELEGATE = function (...args) {
  // 调用CALL_DELEGATE会重新给call方法赋值
  this.call = this._createCall("sync");
  // 执行call方法把参数传入
  return this.call(...args);
};

// async call
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  // 执行真正的编译好的call方法把参数传入
  return this.callAsync(...args);
};

// promise call
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

module.exports = Hook;
