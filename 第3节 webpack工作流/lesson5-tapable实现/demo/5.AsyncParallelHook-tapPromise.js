/**
 * promise 注册钩子
 * 全部完成后执行才算成功
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
queue.promise("zhufeng", 10).then(
  (result) => {
    console.timeEnd("cost");
  },
  (error) => {
    console.log(error);
    console.timeEnd("cost");
  }
);

/**
 (function anonymous(name, age) {
    var _x = this._x;
    return new Promise(function (_resolve, _reject) {
        var _counter = 3;
        var _done = function () {
            _resolve();
        };

        var _fn0 = _x[0];
        var _promise0 = _fn0(name, age);
        _promise0.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn1 = _x[1];
        var _promise1 = _fn1(name, age);
        _promise1.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn2 = _x[2];
        var _promise2 = _fn0(name, age);
        _promise2.then(
            function () {
                if (--_counter === 0) _done();
            }
        );
    });
});
 */
