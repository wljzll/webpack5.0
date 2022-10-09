const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.log('node中=========', process.env.NODE_ENV1);

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
        filename: 'mian.js', // 输出的文件文件名 不写默认是main.js
    },
    devServer: {
        port: '3000', // 配置http服务器预览的端口号 如果不设置默认是8080
        open: true, // 编译成功后会自动打开浏览器进行预览
        compress: true, // 是否启动压缩
        static: path.resolve(__dirname, 'static'), // 除dist之外(因为dist默认就是静态资源根目录)的额外的静态文件的根目录
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader', // 可以进行代码的检查
                enforce: 'pre', // loader的分类 或者执行顺序
                options: { fix: true }, // 如果发现有问题的代码可以自动修复
                exclude: /node_modules/,
            },
            {
                test: /\.js$/, use: [{
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
            { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader', "postcss-loader"] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader', "postcss-loader"] },
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
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV1': JSON.stringify(process.env.NODE_ENV1)
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
    ],
};
