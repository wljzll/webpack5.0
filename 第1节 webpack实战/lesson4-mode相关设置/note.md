## 环境变量mode

## process是node的进程 在项目JS文件中是获取不到的 这里之所以能获取到是因为我们使用了 webpack.DefinePlugin插件向JS中注入了变量

### 1、模块内(也就是项目的JS文件内)的process.env.NODE_ENV是如何配置的
```
1、先根据package.json脚本中的 --mode=环境变量 来，命令行中的优先("build": "webpack --mode=production")
2、如果package.json中没有配置，则看配置文件中的mode是否有值
3、两个地方都没有则默认是production

重要：这两个地方的配置，只影响模块内的process.env.NODE_ENV 不影响node环境中 只配置这两个的话 node环境中的process.env.NODE_ENV为undefined

模块内的process.env.NODE_ENV是如何编译的：模块替换，直接将process.env.NODE_ENV替换成对应的字符串

重要: webpack会从配置文件的mode中自动为process.env.NODE_ENV赋值，而取的值，就是该配置文件的mode属性。如果没有值，则会默认返回“production”。这个就是初始存在的值。

optimization: {
    nodeEnv: false
}

webpack加了这个配置就不会默认用DefinePlugin默认定义process.env.NODE_ENV
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

```
模块内(项目JS文件内)使用的环境变量process.env.NODE_ENV, 只能通过配置文件的 mode 属性 或者 --mode=production|development来设置 
而且名字只能是production|development, 
特别: 你在模块内访问process是报错的, 只能访问process.env.NODE_ENV
webpack内部会通过DefinePlugin默认添加process.env.NODE_ENV向模块注入这个变量

--env=[any]: 只能在配置文件导出的函数参数中获取到和mode/--mode不是一个东西,两者也互不影响

cross-env: 可以向node进程设置任意变量, 当重名时

```
```
                                                                  node环境中     webpack配置文件导出函数参数     模块内
mode:'production|development' | --mode=production|development        否                   否                   是

                                                    --env=xxx        否                   是                   否

                                          cross-env key=value        是                   否                   否
```