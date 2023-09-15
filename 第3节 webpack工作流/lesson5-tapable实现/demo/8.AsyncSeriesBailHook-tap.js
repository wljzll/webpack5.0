/**
 * 带保险的异步串行钩子
 * 只要有一个返回了不为 undefined 的值就直接结束
 */

let { AsyncSeriesBailHook } = require("tapable");
let queue = new AsyncSeriesBailHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
  return "Wrong";
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
