const { SyncHook } = require("../tapable");
const syncHook = new SyncHook(["name", "age"]);

// 注册拦截器
syncHook.intercept({
  // 当你新注册一个回调函数的时候触发
  register: (tapInfo) => {
    console.log(`拦截器1开始register`);
    return tapInfo;
  },
  // 每个回调函数执行都会触发一次
  tap: (tapInfo) => {
    console.log(`拦截器1开始tap`);
  },
  // 每个call触发，所有的回调只会总共触发一次
  call: (name, age) => {
    console.log(`拦截器1开始call`, name, age);
  },
});

syncHook.intercept({
  // 当你新注册一个回调函数的时候触发
  register: (tapInfo) => {
    console.log(`拦截器2开始register`);
    return tapInfo;
  },
  // 每个回调函数执行都会触发一次
  tap: (tapInfo) => {
    console.log(`拦截器2开始tap`);
  },
  // 每个call触发，所有的回调只会总共触发一次
  call: (name, age) => {
    console.log(`拦截器2开始call`, name, age);
  },
});

syncHook.tap({ name: "回调函数A" }, (name, age) => {
  console.log(`回调A`, name, age);
});
//console.log(syncHook.taps[0]);
syncHook.tap({ name: "回调函数B" }, (name, age) => {
  console.log("回调B", name, age);
});
debugger;
syncHook.call("zhufeng", 10);

/**
拦截器1开始register
拦截器2开始register
拦截器1开始register
拦截器2开始register

拦截器1开始call zhufeng 10
拦截器2开始call zhufeng 10

拦截器1开始tap
拦截器2开始tap
回调A zhufeng 10

拦截器1开始tap
拦截器2开始tap
回调B zhufeng 10
*/

/**
 (function anonymous(name, age) {
  var _x = this._x;
  var _taps = this.taps;

  var _interceptors = this.interceptors;
  _interceptors[0].call(name, age);
  _interceptors[1].call(name, age);

  var _tap0 = _taps[0];
  _interceptors[0].tap(_tap0);
  _interceptors[1].tap(_tap0);
  var _fn0 = _x[0];
  _fn0(name, age);

  var _tap1 = _taps[1];
  _interceptors[0].tap(_tap1);
  _interceptors[1].tap(_tap1);
  var _fn1 = _x[1];
  _fn1(name, age);
});
 */
