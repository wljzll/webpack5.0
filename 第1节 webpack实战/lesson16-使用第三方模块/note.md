### 打包第三方模块(以lodash为例)

#### 1. 安装lodash: npm i lodash -D
```javascript
// 安装过之后我们就可以在项目中使用lodash了
import _ from 'lodash';

console.log(_.join(['a', 'b', 'c', 'd']));

// 但是问题来了, 我们可能会频繁多次使用lodash, 如果每次使用都这样导入一下的话太过于麻烦
// 这样lodash变量会挂载到全局上 window._ 但是由于代码执行顺序的原因我们在html模板文件中同步拿不到lodash
```

#### 2. 如何将lodash定义到模块内
```javascript
// 使用webpack.ProvidePlugin()将lodash定义到模块内
    new webpack.ProvidePlugin({
        _: 'lodash',
    }),
```

#### 3. 在入口模块中引入
```javascript
const _ = require('lodash');

console.log(_.join(['a', 'b', 'c', 'd']));

// 这样lodash变量会挂载到全局上 window._ 但是由于代码执行顺序的原因我们在html模板文件中同步拿不到lodash
```


#### 4. 使用expose-loader将lodash暴漏到window上
```javascript
// 配置loader
    {
        test: require.resolve('lodash'),
        loader: 'expose-loader',
        options: {
            exposes: {
                globalName: '_', // 放到全局上的变量名
                override: true, // 如果原来有这个变量值的话是否要覆盖
            },
        },
    },
```