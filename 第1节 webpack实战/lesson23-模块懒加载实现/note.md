## webpack各个简写函数的意义
```
require.e   加载一个额外的代码块 require.ensure 保证/加载
require.f.j require.f.jsonp 使用JSONP加载额外的代码
require.l   require.load
require.o   require.hasOwnProperty
require.p
```

- 懒加载用到的import和ESModule中的export import是一个意思吗?
```javascript
不是, ESModule里的import是导入模块的意思 是关键字
而懒加载的import只是一个普通的方法名或者函数名
```

## 异步加载的基本流程
- 1. 点击按钮
- 2. 加载包含额外代码块的模块定义的JS文件
- 3. JS文件加载回来后JS脚本会执行
- 4. 把新的模块定义合并到老的模块定义上
- 5. 走正常的加载流程 加载新的模块 让Promise resolve 然后走then