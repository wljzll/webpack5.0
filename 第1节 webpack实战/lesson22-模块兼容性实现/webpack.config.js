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
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
        filename: 'main.js', // 输出的文件文件名 不写默认是main.js
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
            {
                test: /\.css$/, use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            mode: 'local',
                            // src-index__title--rssuT
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        },
                        url: true, // 解析css文件中的url
                    }
                }, "postcss-loader"]
            },
            { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', "postcss-loader"] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', "postcss-loader"] },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
    ],
};
