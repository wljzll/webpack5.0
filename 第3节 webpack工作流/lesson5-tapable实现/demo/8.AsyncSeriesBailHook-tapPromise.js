/**
 * 带保险的异步串行钩子-promise 注册钩子
 * 只要有一个返回了不为 undefined 的值就直接结束
 */

let { AsyncParallelHook } = require("tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(1);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(2);
      resolve();
    }, 2000);
  });
});
queue.tapPromise("3", function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(3);
      resolve();
    }, 3000);
  });
});
queue.promise("zhufeng").then(() => {
  console.timeEnd("cost");
});