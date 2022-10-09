/**
 * @babel/core中的transform实现原理
 */

let esprima = require('esprima'); // 将JS代码转成AST抽象语法树
let estraverse = require('estraverse');　// 遍历AST抽象语法树
let escodegen = require('escodegen');　// 从AST抽象语法树生成JS代码

function transform(sourceCode) {
    let ast = esprima.parse(sourceCode);
    estraverse.traverse(ast, {
        enter(node) {
            if (node.type === 'ArrowFunctionExpression') {
                node.type = 'FunctionDeclaration'
            }
        }
    })
    let code = escodegen.generate(ast);
    return { code };
}
exports.transform = transform;