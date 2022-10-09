## CSS兼容性处理

### 1、css-loader是用来翻译处理 @import和url的
### 2、style-loader可以把CSS插入DOM中

### 3、loader配置规则
```
1、配置文件中use的意思是使用哪些loader进行转换
2、loader的执行顺序是从右向左，从下向上
3、最右边的loader接收源文件，最左侧的loader返回一个JS脚本
```
### 4、postcss-loader的配置
```javascript
1、安装postcss-loader - npm i postcss-loader --save-dev
2、在样式处理规则中添加postcss-loader;
3、安装postcss-preset-env预设 - npm i postcss-preset-env --save-dev
4、创建postcss.config.js配置文件：
    let postcssPresetEnv = require('postcss-preset-env');
    module.exports = {
        plugins: [
            postcssPresetEnv({
                browsers: 'last 5 versions'
            })
        ]
    }
```
### 5、如何处理图片资源
```
file-loader解决CSS等文件中的引入图片路径问题
url-loader当图片小于limit的时候会把图片BASE64编码, 大于limit参数的时候还是使用file-loader进行拷贝

npm i file-loader url-loader html-loader --save-dev

file-loader可以把src目录里依赖的源图片文件拷贝到目标目录里去 文件名一般未新的hash值
```

### 6、clean-webpack-plugin的使用
```
npm i clean-webpack-plugin -D

new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*'],
})
```

### 7、JS兼容性 babel的使用
```
1、Babel默认只转换最新的ES语法，比如箭头函数

2、babel-loader使用Babel和webpack转译JavaScript文件
3、@babel @babel/core - Babel编译的核心包
4、babel-preset-env
5、@babel @babel/preset-react - React插件的babel预设
6、@babel/plugin-proposal-decorators 把类和对象的装饰器编译成ES5
7、@babel/plugin-proposal-class-properties转换静态类属性以及使用水星初始值化语法声明的属性


npm i babel-loader @babel/core @babel/preset-env @babel/preset-react -D
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```
```javascript
{
    test: /\.js$/, use: [{
        loader: 'babel-loader',
        options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
            ]
        }
    }]
},
```
- 有些代码是webpack不认识的：比如react、jsx; 有些代码是浏览器不兼容的：比如ES6、ES7

- 所以需要靠babel-loader来编译
- babel-loader只是一个转换函数，并不能识别JS的语法，也不知道如何转换

- @babel/core(转换语法树)：是babel的核心模块，它认识JS代码，能够识别JS代码，但是它不知道如何转换写法
- babel插件知道如何把老语法转成新的语法 每个插件都会对应一个语法，比如箭头函数对应：plugin-transform-arrow-functions，这个插件可以把箭头函数转换成普通函数

- @babel/preset-env预设：ES6、ES7语法很多，我们不希望在配置文件中一个个的写插件，所以就有了预设，预设
  就是常用的插件的集合，使用了这个预设，就是默认使用了预设中内置的插件

- 但是预设中的插件是有限的，也有一些特殊的插件不在预设中，那么就在plugins中自己添加

```javascript
// loose=true和loose=false的区别
class Circle {
    PI = 3.14;
}

// loose=true
function Circle() {
    this.PI = 3.14;
}

// loose=false
function Circle() {
    Object.defineProperty(this, 'PI', 3.14);
}

```
```javascript
// legacy = true 和 legacy = false的区别

// legacy 表示支持老的装饰器的写法
@readonly
class Circle {

}

class @readonly Circle {

}
```