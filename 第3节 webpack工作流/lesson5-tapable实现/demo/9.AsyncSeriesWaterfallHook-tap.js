/**
 * 异步-串行-瀑布流钩子
 * 
 */

let { AsyncSeriesWaterfallHook } = require("tapable");
let queue = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost");
queue.tap("1", function (name, age) {
  console.log(1, name, age);
  return "return1";
});
queue.tap("2", function (data, age) {
  console.log(2, data, age);
  return "return2";
});
queue.tap("3", function (data, age) {
  console.log(3, data, age);
});
queue.callAsync("zhufeng", 10, (err) => {
  console.log(err);
  console.timeEnd("cost");
});