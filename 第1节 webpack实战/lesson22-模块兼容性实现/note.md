## 模块ID
- 不管你是用什么样的路径来加载的, 最终模块ID统一会变成相对根目录的相对路径
- index.js => ./src/index.js
- title.js => ./src/title.js
- jquery ./node_modules/jquery/dist/jquery.js

## commonJS规范
```javascript
module.exports
exports
require()
```

## ESModule规范
```javascript

export default
export.xxx
import
```

## CommonJS如何加载CommonJS
```javascript
// webpack在编译CommonJS导入的时候 因为是直接支持CommonJS的, 所以CommonJS的导入没有修改

```

## CommonJS如何加载ESModule
```javascript
// webpack在编译ESModule的导出时, 是对ESModule的导出语法做了编译处理

webpack打包时将ESModule转换成CommonJS
export default 会变成exports.default
export xxx 会变成 exports.xxx
```


## 为什么webpack编译后的代码里有的方法用一个字母，而有些类名很长
```
像__webpack__require__为什么这么长?
__webpack__require__.r的r为什么又这么短?

因为类名在压缩的时候可以被压缩
但是属性名就无法压缩了所以要用简短的字母
```

## CommonJS规范和import规范的区别
```javascript
CommonJS 模块输出的时值的拷贝(如果是引用类型, 则是引用类型的地址) ES6模块输出的是值的引用

CommonJs 模块是运行时加载 ES6模块是编译时输出接口
```