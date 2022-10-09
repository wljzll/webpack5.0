# 调试webpack源码的三种方法

- 1. 通过chrome调试
```shell
node --inspect-brk ./node_modules/webpack-cli/bin/cli.js

注意: 要是你的配置文件写错了 不会出现正确的断点或者不会出现断点
```

- 2. 通过执行命令调试
```javascript
// 1. 打开工程目录, 找到/node_modules/webpack-cli/bin/cli.js, 选择cli.js后 
//    点击调试按钮, 再点击小齿轮的配置按钮系统就会生成 launch.json配置文件
// 2. 在cli.js中写一个debugger
// 3. 修改好以后直接点击F5就可以启动调试

// {
//     "version": "0.2.0",
//     "configurations": [
//         {
//             "type": "node",
//             "request": "launch",
//             "name": "debug webpack",
//             "skipFiles": [ // 这个的意思是跳过内核文件
//                 "<node_internals>/**"
//             ],
//             "program": "${workspaceFolder}\\lesson1\\node_modules\\webpack-cli\\bin\\cli.js" // 这里一定要指向cli.js
//         }
//     ]
// }
```
- 3. 自己写一个debugger.js文件
```
const webpack = require('webpack');
const options = require('./webpack.config');
debugger;
const compiler = webpack(options);
compiler.run((err, stats) => {
    console.log(err);
    console.log(JSON.stringify(stats.toJson({
        assets: true,
        chunks: true,
        modules: true,
        entries: true,
    }), null, 2));
})
```
```javascript
// 这是stats.toJson()的结果
{
  "hash": "edd79cfdee57262197ba",
  "version": "5.74.0",
  "time": 80,
  "builtAt": 1665147029121,
  "publicPath": "auto",
  "outputPath": "E:\\前端学习\\webpack-learn\\第3节 webpack工作流\\lesson1\\dist",
  "assetsByChunkName": {
    "main": [
      "main.js"
    ]
  },
  "assets": [
    {
      "type": "asset",
      "name": "main.js",
      "size": 1206,
      "emitted": false,
      "comparedForEmit": true,
      "cached": false,
      "info": {
        "javascriptModule": false,
        "size": 1206
      },
      "chunkNames": [
        "main"
      ],
      "chunkIdHints": [],
      "auxiliaryChunkNames": [],
      "auxiliaryChunkIdHints": [],
      "related": {},
      "chunks": [
        "main"
      ],
      "auxiliaryChunks": [],
      "isOverSizeLimit": false
    }
  ],
  "chunks": [
    {
      "rendered": true,
      "initial": true,
      "entry": true,
      "recorded": false,
      "size": 1,
      "sizes": {
        "javascript": 1
      },
      "names": [
        "main"
      ],
      "idHints": [],
      "runtime": [
        "main"
      ],
      "files": [
        "main.js"
      ],
      "auxiliaryFiles": [],
      "hash": "5cf757d7b8abb84003dc",
      "childrenByOrder": {},
      "id": "main",
      "siblings": [],
      "parents": [],
      "children": [],
      "origins": [
        {
          "module": "",
          "moduleIdentifier": "",
          "moduleName": "",
          "loc": "main",
          "request": "./src/index.js"
        }
      ]
    }
  ],
  "modules": [
    {
      "type": "module",
      "moduleType": "javascript/auto",
      "layer": null,
      "size": 1,
      "sizes": {
        "javascript": 1
      },
      "built": true,
      "codeGenerated": true,
      "buildTimeExecuted": false,
      "cached": false,
      "identifier": "E:\\前端学习\\webpack-learn\\第3节 webpack工作流\\lesson1\\src\\index.js",
      "name": "./src/index.js",
      "nameForCondition": "E:\\前端学习\\webpack-learn\\第3节 webpack工作流\\lesson1\\src\\index.js",
      "index": 0,
      "preOrderIndex": 0,
      "index2": 0,
      "postOrderIndex": 0,
      "cacheable": true,
      "optional": false,
      "orphan": false,
      "issuer": null,
      "issuerName": null,
      "issuerPath": null,
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "id": "./src/index.js",
      "issuerId": null,
      "chunks": [
        "main"
      ],
      "assets": [],
      "reasons": [
        {
          "moduleIdentifier": null,
          "module": null,
          "moduleName": null,
          "resolvedModuleIdentifier": null,
          "resolvedModule": null,
          "type": "entry",
          "active": true,
          "explanation": "",
          "userRequest": "./src/index.js",
          "loc": "main",
          "moduleId": null,
          "resolvedModuleId": null
        }
      ],
      "usedExports": null,
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 0
    }
  ],
  "entrypoints": {
    "main": {
      "name": "main",
      "chunks": [
        "main"
      ],
      "assets": [
        {
          "name": "main.js",
          "size": 1206
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 1206,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "namedChunkGroups": {
    "main": {
      "name": "main",
      "chunks": [
        "main"
      ],
      "assets": [
        {
          "name": "main.js",
          "size": 1206
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 1206,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "errors": [],
  "errorsCount": 0,
  "warnings": [],
  "warningsCount": 0,
  "children": []
}
```
