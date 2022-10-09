## 环境变量mode

### 1、模块内的process.env.NODE_ENV是如何配置的
```
1、先根据package.json脚本中的 --mode=环境变量 来，命令行中的优先("build": "webpack --mode=production")
2、如果package.json中没有配置，则看配置文件中的mode是否有值
3、两个地方都没有则默认是production

重要：这两个地方的配置，只影响模块内的process.env.NODE_ENV 不影响node环境中 只配置这两个的话 node环境中的process.env.NODE_ENV为undefined

模块内的process.env.NODE_ENV是如何编译的：模块替换，直接将process.env.NODE_ENV替换成对应的字符串
```

### 2、在package.json中配置脚本 ("build": "webpack --env=production")
```
这时env的值会传递给配置文件导出的函数的参数env { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }

在模块内和node环境中是获取不到的
```

### 3、使用cross-env在脚本中设置("build": "cross-env NODE_ENV=development webpack")
```
1、在windows环境中通过命令行 set key=value 这种形式设置值
2、在mac和linux中通过 export key1=value1  这种形式设置值

为了统一环境使用 cross-env跨环境设置环境变量

cross-env设置的才是真正的环境变量，只有在node环境中才能取到，配置文件函数参数和模块内都取不到
cross-env设置的这个变量是真正的变量，NODE_ENV可以为任何值
```

### 在配置文件中通过webpack.DefinePlugin插件将node环境中的环境变量打入到模块内
```javascript
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
```
```
同时使用mode选项和DefinePlugin插件会有冲突
Conflicting values for 'process.env.NODE_ENV'

不设置mode选项也会有冲突
WARNING in DefinePlugin
Conflicting values for 'process.env.NODE_ENV'

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for 
this value.

所以想让node进程和模块内公用同一个变量可以通过cross-env设置非NODE_ENV变量
```