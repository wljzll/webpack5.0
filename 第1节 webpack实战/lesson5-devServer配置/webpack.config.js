const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

console.log('node中=========', process.env.NODE_ENV1);

module.exports = (env) => {
    console.log('配置文件中=========', process.env.NODE_ENV);
    console.log('配置文件中=========', env);
    return {
        mode: 'production',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
            filename: 'main.js' // 输出的文件文件名 不写默认是main.js
        },
        devServer: {
          port: '3000', // 配置http服务器预览的端口号 如果不设置默认是8080
          open: true, // 编译成功后会自动打开浏览器进行预览
          compress: true, // 是否启动压缩
          static: path.resolve(__dirname, 'static'), // 除dist之外(因为dist默认就是静态资源根目录)的额外的静态文件的根目录
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