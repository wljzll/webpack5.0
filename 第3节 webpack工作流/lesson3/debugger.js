// 加载webpack
const webpack = require('./webpack');
// 加载配置文件
const options = require('./webpack.config');
// 将配置项交给webpack执行 返回compiler对象
const compiler = webpack(options);

compiler.run((err, stats) => {
    console.log(err);
    console.log(JSON.stringify(stats.toJson({
        assets: true,
        chunks: true,
        modules: true,
        entries: true,
    }), null, 2));
});