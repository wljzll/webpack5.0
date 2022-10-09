/**
 * 实现babel插件: 将箭头函数转换成ES5普通函数
 * npm i @babel/core babel-types babel-plugin-transform-es2015-arrow-functions -D
 */

/**
 * const sum = (a,b) => {
 *   console.log(this);
 *   return a + b;
 * }
 * 转成
 * var _this = this;
 * function sum (a, b) {
 *   console.log(_this);
 *   return a + b;
 * }
 */

const { transform } = require('@babel/core');
let types = require('babel-types');
// let babelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');

let babelPluginTransformEs2015ArrowFunctions = {
    // 插件都会提供一个访问器 visitor
    visitor: {
        ArrowFunctionExpression(nodePath) { // nodePath中的node对应的就是抽象语法树中的对应代码的抽象语法树
            // console.log(nodePath);
            let node = nodePath.node;
            hoistFunctionEnvironment(nodePath);
            node.type = "FunctionExpression"; // 修改节点属性 这样就可以把箭头函数转换成普通函数
        }
    }
}


function hoistFunctionEnvironment(fnPath) {
    const thisEnvFn = fnPath.findParent((p) => {
        // 如果当前是Function并且不是箭头函数或者是Program
        return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
    })
    let thisPaths = getScopeInfomation(fnPath); // 找到函数内部有多少个对this的引用

    if (thisPaths.length) {
        // 在父作用域中声明 var _this = this;
        let thisBinding = '_this';
        // 生成this的描述符
        let thisIdentifier = types.identifier(thisBinding);
        thisEnvFn.scope.push({
            type: "VariableDeclaration", // type：VariableDeclaration在抽象语法树里表示是声明变量
            id: thisIdentifier, // 声明的变量名
            init: types.thisExpression(), // 变量值
        });
        // 用新生成的_this替换到老的this
        thisPaths.forEach(path => {
            path.replaceWith(thisIdentifier);
        })
    }

}
// 收集函数体内部有多少对this的引用
function getScopeInfomation(fnPath) {
    let thisPaths = [];
    // 遍历箭头函数的抽象语法树
    fnPath.traverse({
        // 遍历的语法是如果有this就会进入ThisExpression这个访问器
        ThisExpression(thisPath) {
            // 收集这个this的路径
            thisPaths.push(thisPath);
        }
    })
    return thisPaths;
}

let sourceCode = `
const sum = (a,b) => {
    console.log(this);
    return a + b;
}
`;

let { code } = transform(sourceCode, {
    plugins: [babelPluginTransformEs2015ArrowFunctions],
})
console.log(code);
