const webpack = require('webpack');
const options = require('./webpack.config');
debugger;
const compiler = webpack(options);
compiler.run((err, stats) => {
    console.log(err);
    console.log(JSON.stringify(stats.toJson({
        assets: true,
        chunks: true,
        modules: true,
        entries: true,
    }), null, 2));
})