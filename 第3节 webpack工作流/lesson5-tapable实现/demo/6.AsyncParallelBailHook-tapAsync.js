/**
 * 带保险的异步并行执行钩子
 * 有一个任务返回值不为空就直接结束
 * 对于promise来说，resolve还reject并没有区别
 *  区别在于你是否传给它们的参数
 */

let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
console.time("cost");
queue.tapAsync("1", function (name, callback) {
  console.log(1);
  callback("Wrong");
});
queue.tapAsync("2", function (name, callback) {
  console.log(2);
  callback();
});
queue.tapAsync("3", function (name, callback) {
  console.log(3);
  callback();
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
