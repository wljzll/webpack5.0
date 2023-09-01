// 导出简单值
let count = 0;
exports.count = count; // 输出值的拷贝
exports.add = () => {
  //这里改变count值，并不会将module.exports对象的count属性值改变
  count++;
};

// 导出引用类型
// let count = { value: 'hello'};
// exports.count = count; // 输出值的拷贝
// exports.add = () => {
//   //这里改变count值，并不会将module.exports对象的count属性值改变
//   count.value = 'world';
// };
