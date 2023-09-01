// 加载webpack
const webpack = require('./webpack');
// 加载配置文件
const options = require('./webpack.config');
debugger;
// 将配置项交给webpack执行 返回compiler对象
const compiler = webpack(options);
console.log('debugger', process.cwd());
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    JSON.stringify(
      stats.toJson({
        assets: true, // 资源
        chunks: true, // 代码块
        modules: true,// 模块
        entries: true, // 入口
      }),
      null,
      2
    )
  );
});
