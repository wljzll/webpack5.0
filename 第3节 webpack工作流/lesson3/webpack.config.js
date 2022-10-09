const path = require('path');
const RunPlugin = require('./plugins/run-plugins');
const DonePlugin = require('./plugins/done-plugins');

module.exports = {
    mode: 'production',
    devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    modules: {
        rules: [],
    },
    plugins: [
        new RunPlugin(),  // 开始编译的时候触发run事件, RunPlugin会监听整个事件执行回调
        new DonePlugin(), // 编译完成的时候会触发done事件, DonePlugin会监听这个done事件的回调
    ]
}