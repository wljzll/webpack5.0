/**
 * 配置文件可以有层次解构的 可以继承
 */

// module.exports = {
//     // root: true, // 表示这是根配置 注释掉表示不再是根配置文件了
//     extends: 'airbnb', // extends表示继承自airbnb规范
//     parser: 'babel-eslint', // 把源代码转换成AST
//     parserOptions: {
//         sourceType: 'module',
//         ecmaVersion: 2015,
//     },
//     // env表示代码运行在哪个环境里
//     env: {
//         browser: true, // 表示代码运行在浏览器环境中 如果没有这个配置 window.a就会被eslint检查出来报错
//         node: true,
//     },
//     // 启用的代码检查规则和各自的错误级别
//     rules: {
//         indent: "off", // 缩进风格
//         // "indent": ["error", 2],
//         quotes: "off", // 引号的类型
//         "no-console": "off", // 禁止使用console.log
//     },
// };
