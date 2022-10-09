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

### 6、clean-webpack-plugin
```
npm i clean-webpack-plugin -D
```