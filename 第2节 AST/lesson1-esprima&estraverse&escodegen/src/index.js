let esprima = require('esprima'); // 将JS代码转成AST抽象语法树
let estraverse = require('estraverse');　// 遍历AST抽象语法树
let escodegen = require('escodegen');　// 从AST抽象语法树生成JS代码

let sourceCode = `function ast() {}`;
let ast = esprima.parse(sourceCode);
console.log(JSON.parse(JSON.stringify(ast), null, 5));

let indent = 0;
const padding = () => ' '.repeat(indent);
// estraverse遍历语法树的过程是一个深度优先的过程
// estraverse遍历语法树用到了一个设计模式 访问器模式
estraverse.traverse(ast, {
    enter(node) {
        console.log(padding() + node.type + '进入');
        indent += 2;
    },
    leave(node) {
        indent -= 2;
        console.log(padding() + node.type + '离开');
    }
})