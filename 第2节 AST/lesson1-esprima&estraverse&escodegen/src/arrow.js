/**
 * 实现babel插件: 将箭头函数转换成ES5普通函数
 * npm i @babel/core babel-types babel-plugin-transform-es2015-arrow-functions -D
 */

// const { transform } = require('@babel/core');
let types = require('babel-types');
let babelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');

// 自己实现transform+plugin
let { transform } = require('./transform');

let sourceCode = `
const sum = (a,b) => {
    return a + b;
}
`;

let { code } = transform(sourceCode, {
    plugins: [babelPluginTransformEs2015ArrowFunctions],
})
console.log(code);
