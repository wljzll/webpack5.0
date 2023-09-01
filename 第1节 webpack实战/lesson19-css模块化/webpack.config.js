const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FilemagagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
console.log('node中=========', process.env.NODE_ENV1);

module.exports = {
    mode: 'development',
    devtool: 'hidden-source-map',
    // devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
        filename: 'main.js', // 输出的文件文件名 不写默认是main.js
        // publicPath: '/',
    },
    devServer: {
        port: '3000', // 配置http服务器预览的端口号 如果不设置默认是8080
        open: true, // 编译成功后会自动打开浏览器进行预览
        compress: true, // 是否启动压缩
        static: path.resolve(__dirname, 'static'), // 除dist之外(因为dist默认就是静态资源根目录)的额外的静态文件的根目录
    },
    // 配置外部模块 key是模块名 value是全局变量名
    externals: {
      'jquery': 'jQuery',
      'lodash': '_',  
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader', // 可以进行代码的检查
            //     enforce: 'pre', // loader的分类 或者执行顺序
            //     options: { fix: true }, // 如果发现有问题的代码可以自动修复
            //     exclude: /node_modules/,
            // },
            // {
            //     test: require.resolve('lodash'),
            //     loader: 'expose-loader',
            //     options: {
            //         exposes: {
            //             globalName: '_', // 放到全局上的变量名
            //             override: true, // 如果原来有这个变量值的话是否要覆盖
            //         },
            //     },
            // },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
                            ["@babel/plugin-proposal-private-methods", { loose: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                        ],
                    },
                }],
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, {
                loader: 'css-loader',
                options: {
                    modules: {
                        mode: 'local',
                        // src-index__title--rssuT
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    },
                    url: true, // 解析css文件中的url
                }
            }, "postcss-loader"] },
            { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', "postcss-loader"] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', "postcss-loader"] },
            // 第一种：直接使用file-loader
            // {
            //     test: /\.(jpg|png|gif|bmp|svg|webp)$/, use: [{
            //         loader: 'file-loader'
            //     }]
            // },
            // 第二种：使用url-loader
            {
                test: /\.(jpg|png|gif|bmp|svg|webp)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false, // false是不将图片打包成ES6模块, ES6模块在取的时候需要.defalut 非ES6模块则直接使用即可
                        name: `[hash:8].[ext]`,
                        limit: 121 * 1024, // 如果文件小于这个阈值 就不会拷贝图片 而是把图片转成BASE64嵌入到文件中
                    },
                }],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV1': JSON.stringify(process.env.NODE_ENV1),
        // }),
        new webpack.ProvidePlugin({
            _: 'lodash',
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
        // 由此插件来生成sourceMap文件
        // new webpack.SourceMapDevToolPlugin({
        //     append: '\n//# sourceMappingURL=http://127.0.0.1:8081/[url]', // 向输出文本里添加的映射文本
        //     filename: '[file].map', // main.js的sourcemap文件叫 main.js.map
        // }),
        // 这个插件的作用就是将生成的sourceMap文件拷贝的指定的目录后再将dist目录中的map文件删除 只放在本机 并不部署到测试环境
        new FilemagagerPlugin({
            events: {
                onEnd: {
                    copy: [{
                        source: './dist/*.map',
                        destination: path.resolve(__dirname, 'maps'),
                    }],
                    delete: ['./dist/*.map'],
                    archive: [{
                        source: './dist',
                        destination: './dist/dist.zip',
                    }],
                },
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        })
    ],
};
