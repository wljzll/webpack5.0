/**
 * 异步注册，全部任务完成后执行最终的回调
 */

let { AsyncParallelHook } = require("../tapable");
let queue = new AsyncParallelHook(["name", "age"]);
console.time("cost");
queue.tapAsync("1", function (name, age, callback) {
  setTimeout(function () {
    console.log(1, name, age);
    callback();
  }, 1000);
});
queue.tapAsync("2", function (name, age,  callback) {
  setTimeout(function () {
    console.log(2, name, age);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, age, callback) {
  setTimeout(function () {
    console.log(3, name, age);
    callback();
  }, 3000);
});

queue.callAsync("zhufeng", 10, (err) => {
  console.log(err);
  console.timeEnd("cost");
});
