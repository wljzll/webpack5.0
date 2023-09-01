const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

console.log('node中:',process.env.NODE_ENV, process.env.NODE_ENV1);

module.exports = (env) => {
    console.log('配置文件中的:', process.env.NODE_ENV, process.env.NODE_ENV1);
    console.log('配置文件导出函数中的:', env);
    return {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
            filename: 'mian.js' // 输出的文件文件名 不写默认是main.js
        },
        module: {
            rules: [
                { test: /\.css$/, use: ["style-loader", "css-loader"] }
            ]
        },
        optimization: {
            nodeEnv: false
          },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ]
    }
}