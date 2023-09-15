/**
 * 异步串行钩子
 * 任务一个一个执行,执行完上一个执行下一个
 */

let { AsyncSeriesHook } = require("tapable");
let queue = new AsyncSeriesHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  setTimeout(function () {
    console.log(1);
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
