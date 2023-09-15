/**
 * 1、所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
 * 2、参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
 * 3、如果回调函数不接受参数，可以传入空数组
 * 4、在实例化的时候传入的数组长度长度有用，值没有用途
 * 5、执行 call 时，参数个数和实例化时的数组长度有关
 * 6、回调的时候是按先入先出的顺序执行的，先放的先执行
 */

// 1、加载SyncHook类
const { SyncHook } = require("../tapable");

// 2、创建实例
const hook = new SyncHook(["name", "age"]);

// 3、注册事件
hook.tap("1", (name, age) => {
  console.log(name, age);

  return 1;
});

// 3、注册事件
hook.tap("2", (name, age) => {
  console.log(name, age);

  return 2;
});

// 3、注册事件
hook.tap("3", (name, age) => {
  console.log(name, age);

  return 3;
});

// 4、触发事件执行
hook.call("珠峰", 12);
