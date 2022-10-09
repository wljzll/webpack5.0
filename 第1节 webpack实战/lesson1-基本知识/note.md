## 一、项目中安装webpack
```shell
npm i webpack webpack-cli --save-dev
```

## 二、webpack打包的默认入口文件
```
什么都不配置的情况下默认是src/index.js
```
## 三、webpack默认只能处理JS和JSON文件：处理CSS报错
```
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|     background-color: green;
| }
```

## 四、webpack默认现在也能把txt打包，但是是把txt文件当成JS文件打包的，但是txt文件中不能有内容，否则也是报错

## 五、如果配置文件没有设置mode，构建时会有提示
```
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
```

# npm run build执行这个脚本的时候怎么执行的？？？
```
1、执行npm run build时会执行shell脚本，也就是webpack的shell脚本
2、在执行npm run build之前会把node_modules\.bin添加到环境变量的PATH里
3、执行命令时就会根据环境变量去找这个路径下的\node_modules\.bin\webpack.cmd这个shell脚本，去执行这个脚本
4、如果第三步没有找到webpack.cmd这个shell脚本，则会去全局的命令里找: 执行npm root -g就能打印出全局命令的路径 C:\Users\Administrator\AppData\Roaming\npm\node_modules
5、如果第四步还没找到，就会找其他PATH路径，也就是高级系统设置里的两个环境变量
6、如果以上都没找到，那就会报错

核心一句话就是找环境变量中PATH变量指定的路径的集合，找到webpack.cmd这个脚本的路径，去执行
```