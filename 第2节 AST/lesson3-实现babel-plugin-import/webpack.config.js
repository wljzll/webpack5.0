const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    // 这里省略了babel-plugin-import
                    // plugins: [
                    //     ['import', { libraryName: 'lodash' }]
                    // ]
                    // 使用自己的plugins
                    // plugins: [
                    //     [
                    //         path.resolve(__dirname, "plugins/babel-plugin-import.js"),
                    //         { libraryName: 'lodash' }
                    //     ]
                    // ]
                }
            }]
        }]
    }
}