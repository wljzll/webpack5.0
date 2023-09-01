// export let count = 0;

// export const add = () => {
//   count++;
// };

// 导出引用类型
export let count = { value: "hello" };
export const add = () => {
  count.value = "world";
};
