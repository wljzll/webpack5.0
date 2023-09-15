/**
 * 带保险的异步并行执行钩子
 * 有一个任务返回值不为空就直接结束
 * 对于promise来说，resolve还reject并没有区别
 *  区别在于你是否传给它们的参数
 */

let { AsyncParallelBailHook } = require("tapable");
let queue = new AsyncParallelBailHook(["name"]);
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
