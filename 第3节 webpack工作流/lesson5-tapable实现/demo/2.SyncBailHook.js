/**
 * BailHook 中的回调函数也是顺序执行的
 * 调用 call 时传入的参数也可以传给回调函数
 * 当回调函数返回非 undefined 值的时候会停止调用后续的回调
 */

const { SyncBailHook } = require("tapable");

const hook = new SyncBailHook(["name", "zhufeng"]);
console.time("cost");
hook.tap("1", (name, age) => {
  console.log(1, name, age);
//   return 1;
});

hook.tap("2", (name, age) => {
  console.log(2, name, age);
//   return 2;
});

hook.tap("3", (name, age) => {
  console.log(3, name, age);
  return 3;
});

hook.call("zhufeng", 10);
console.timeEnd("cost");