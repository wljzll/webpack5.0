const path = require('path');

module.exports = {
    // mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出文件夹路径
        filename: 'mian.js' // 输出的文件文件名 不写默认是main.js
    },
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader", "css-loader"] }
        ]
    }
}