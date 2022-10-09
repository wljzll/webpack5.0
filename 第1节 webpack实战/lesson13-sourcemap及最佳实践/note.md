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

### 8、eslint
```shell
npm install eslint eslint-loader babel-eslint -D
```
```javascript
// loader是有分类的： pre post normal inline

let rules = [
    {test: /\.js$/, use: 'loader1'},
    {test: /\.js$/, use: 'loader2', enforce: 'post'},
    {test: /\.js$/, use: 'loader3', enforce: 'pre'},
]

// 不加enforce默认是normal
// pre loader3 => normal loader1 => post loader2

// 厚(post)脸(inline)挣(normal)钱(pre)
```

```javascript
// 如何配置eslint

/**
 * 1. 在webpack配置文件中添加eslint-loader对JS文件进行检查
    {
        test: /\.js$/,
        loader: 'eslint-loader', // 可以进行代码的检查
        enforce: 'pre', // loader的分类 或者执行顺序
        options: {fix: true}, // 如果发现有问题的代码可以自动修复
        exclude: /node_modules/
　　},

*  2. 在根目录下创建.eslintrc.js文件 这个文件里导出eslint的规则
   module.exports = {
        // root: true, // 表示这是根配置 注释掉表示不再是根配置文件了
        extends: 'airbnb', // extends表示继承自airbnb规范
        parser: 'babel-eslint', // 把源代码转换成AST
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2015,
        },
        // env表示代码运行在哪个环境里
        env: {
            browser: true, // 表示代码运行在浏览器环境中 如果没有这个配置 window.a就会被eslint检查出来报错
            node: true,
        },
        // 启用的代码检查规则和各自的错误级别
        rules: {
            // "indent": "off", // 缩进风格
            "indent": ["error", 2],
            "quotes": "off", // 引号的类型
            "no-console": "off", // 禁止使用console.log
        }
    }

    3. 经过以上两步 我们在打包构建的就会先通过eslint对代码进行检查 对于不符合规范的代码会有各种级别的提示

    4. 为了方便使用，我们肯定希望我们在编写代码的时候就能给出相应的提示，并且当我们保存代码时能够自动修复错误
       4.1 在vscode中安装Eslint插件;
       4.2 在项目根目录下创建 .vscode文件夹
       4.3 在 .vscode文件夹中创建 .settings.json 文件
       4.4 在.setting.json中编写Eslint插件配置
    {
        "eslint.validate": [
            "javascript",
            "javascriptreact",
            "typescript",
            "typescriptreact"
        ],
        "editor.codeActionOnSave": { // 表示在保存时就自动修复代码
            "source.fixAll.eslint": true
        }
    }
*/

```

### sorcemap

#### 什么是soucemap
```javascirpt
1. sourcemap时为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
2. webpack通过配置可以自动给我们生成 source maps 文件, map文件是一种对应编译文件和源文件的方法
```

#### soucemap关键字
```javascript
1. sourcemap看似配置项很多, 其实只是五个关键字 eval source-map cheap module和inline的任意组合
2. 关键字可以任意组合 但是有顺序要求;


eval: 使用eval包裹模块代码
source-map: 产生soucemap文件
cheap: 不包含列信息也不包含loader的sourcemap
       不包含列信息：就是值报错的时候，我们看报错信息只会映射到行 不会映射到具体哪一列报错
       不包含loader的sourcemap：webpack编译代码是从  源代码 => loader转换成ES5代码 => webpack打包经过压缩等处理是最终代码
       cheap就是不包含源代码到loader转换后的代码的映射的
       只有源代码到webpack最终打包的代码的映射
module: 包含loader的sourcemap但是不包含列信息
inline: 将.map作为DataURI嵌入，不单独生成map文件

```
#### 最佳实践
```javascript
// 开发环境
1. 我们在开发环境对sourceMap的要求是速度快、调试更友好
2. 要想速度快 推荐 eval-cheap-source-map
3. 如果想要调试更友好 推荐 cheap-module-source-map
4. 折中的选择就是 eval-source-map

// 生产环境
1. 首先排除内联，因为一方面我们要隐藏源代码 另一方面要减少文件体积
2. 要想调试友好，sourcemap > cheap-source-map/cheap-module-source-map/nosources-sourcemap
3. 要想速度快 优先选择cheap
4. 折中的选择就是 hidden-source-map

```