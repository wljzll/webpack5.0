const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

console.log('node中=========', process.env.NODE_ENV1);

module.exports = (env) => {
    console.log('配置文件中=========', process.env.NODE_ENV);
    console.log('配置文件中=========', env);
    return {
        // mode: 'production',
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
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV1': JSON.stringify(process.env.NODE_ENV1)
            })
        ]
    }
}