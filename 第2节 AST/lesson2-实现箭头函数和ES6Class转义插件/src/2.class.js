// class Person {
//     constructor(name) {
//         this.name = name;
//     }
//     getName() {
//         return this.name;
//     }
// }
// 转成
// function Person (name){
//   this.name = name;
// }
// Person.prototype.getName = function () {
//     return this.name;
// }

const core = require('@babel/core'); // @babel/core将源代码使用插件转成目标代码并生成最终代码
let types = require('babel-types');

// 自己实现转换插件
const pluginTransformClasses = {
    visitor: {
        ClassDeclaration(nodePath) {
            // 解构出抽象语法树中ES6 Class的树 node
            let { node } = nodePath;
            // 从node中解构出id
            let { id } = node;
            // 从语法树中拿到原有的方法
            let classMethods = node.body.body;
            let nodes = [];
            // 遍历类的方法创建兼容性方法
            classMethods.forEach(classMethod => {
                if (classMethod.kind === 'constructor') { // 如果方法名是constructor
                    // 使用类的类名创建一个函数 除了函数名复用类名其他的都复用构造函数的
                    let constructorFunction = types.functionDeclaration(
                        id,
                        classMethod.params,
                        classMethod.body,
                        classMethod.generator,
                        classMethod.async
                    );
                    // 将创建的节点存放到数组中
                    nodes.push(constructorFunction);
                } else { // 普通函数
                    // 创建 Person.prototype表达式
                    let prototypeExpression = types.memberExpression(
                        id,
                        types.identifier('prototype')
                    );
                    // 创建 Person.prototype.getName表达式
                    let memberExpression = types.memberExpression(
                        prototypeExpression,
                        classMethod.key
                    );
                    // 创建函数表达式 不是创建函数声明 
                    // function getName(){}这是函数声明
                    // xx = function(){} 这是函数表达式
                    let functionExpression = types.functionExpression(
                        // classMethod.key,
                        null,
                        classMethod.params,
                        classMethod.body,
                        classMethod.generator,
                        classMethod.async,
                    );
                    // 将函数赋值给表达式 Person.prototype.getName = function(){};
                    let assignmentExpression = types.assignmentExpression(
                        "=",
                        memberExpression,
                        functionExpression
                    );
                    // 将创建的节点存放到数组中
                    nodes.push(assignmentExpression);
                }
            });
            // 用新创建的节点替换老的节点
            nodePath.replaceWithMultiple(nodes);
        }
    }
}

// 源代码
let sourceCode = `
    class Person {
        constructor(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
    }
`;

// 使用@babel/core的transform方法调用插件转换并生成代码
let { code } = core.transform(sourceCode, {
    plugins: [pluginTransformClasses],
})

console.log(code);