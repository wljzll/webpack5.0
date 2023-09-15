/**
 * 异步并行的钩子
 */

const { AsyncParallelHook } = require("tapable");

let queue = new AsyncParallelHook(["name"]);
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
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

/**
 * 编译的精简结果
  var _x = this._x;
  var _counter = 3;
  var _done = function () {
    _callback();
  };

  var _fn0 = _x[0];
  _fn0(name);
  if (--_counter === 0) _done();

  var _fn1 = _x[1];
  _fn1(name);
  if (--_counter === 0) _done();

  var _fn2 = _x[2];
  _fn2(name);

  if (--_counter === 0) _done();
 */
