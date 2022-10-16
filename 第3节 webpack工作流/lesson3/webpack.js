
let Compiler = require('./Compiler');

function webpack(options) {
    // 1. 初始化参数: 从配置文件和shell语句中读取并合并参数, 得出最终的配置对象
    // process.argv: [ 'D:\\node\\node.exe', 'E:\\前端学习\\webpack-learn\\第3节 webpack工作流\\lesson3\\debugger.js']
    console.log(process.argv);
    // process.argv: [ 'D:\\node\\node.exe', 'E:\\前端学习\\webpack-learn\\第3节 webpack工作流\\lesson3\\debugger.js', '--mode=development']
    // 截取真正的参数 ['--mode=development', '--watch=true']等
    let argv = process.argv.slice(2); // 真正的参数是除数组的前两项外
    // 遍历命令行参数处理成键值对
    let shellOptions = argv.reduce((shellOption, option) => {
        // '--mode=development': 分割解构出命令行参数
        let [key, value] = option.split('='); // 用=分割: ['--mode', 'development']
        // key = '--mode': key.slice(2)去掉-- memo['mode'] = development
        shellOption[key.slice(2)] = value;
        // 返回处理后所有的命令行参数
        // {
        //     mode: 'development',
        //     watch: true,
        // }
        return shellOption;
    }, {});
    // 真正的源码里是用webpack-merge合并的 并不能通过这种暴力合并合并参数
    let finalOptions = { ...options, ...shellOptions };
    // 2. 用上一步得到的参数初始化Compiler对象
    let compiler = new Compiler(finalOptions);

    // 3. 加载所有配置的插件
    // 解构出插件
    let { plugins } = finalOptions;
    // 遍历所有插件
    for (let plugin of plugins) {
        // 执行插件的apply方法并将compiler实例传入
        plugin.apply(compiler);
    }

    return compiler;
}

module.exports = webpack;
