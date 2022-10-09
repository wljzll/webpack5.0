## https://astexplorer.net/ AST语法树可视化网站

## 常用的Javascript Parser
```
npm i esprima estraverse -S
```

## esprima的作用
- 将js语法转换成ast抽象语法树
```javascript
let sourceCode =  `function ast() {}`;
let ast = esprima.parse(sourceCode);

// Script {
//   type: 'Program',
//   body: [
//     FunctionDeclaration {
//       type: 'FunctionDeclaration',
//       id: [Identifier],
//       params: [],
//       body: [BlockStatement],
//       generator: false,
//       expression: false,
//       async: false
//     }
//   ],
//   sourceType: 'script'
// }
```
## estraverse的作用
- 遍历esprima生成的AST抽象语法树
```javascript
    // Program进入
    // FunctionDeclaration进入
    //     Identifier进入
    //     Identifier离开
    //     BlockStatement进入
    //     BlockStatement离开
    // FunctionDeclaration离开
    // Program离开
```