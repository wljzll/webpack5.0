let { SyncHook } = require('tapable');
let Compilation = require('./Complication');
const fs = require('fs');
const path = require('path');
/**
 * Complier是编译大管家: 负责整个编译过程, 保存着整个编译所有的信息
 */
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在结束编译的时候触发
    };
  }
  // 4. 执行Complier对象的run方法
  run(callback) {
    // 触发run钩子执行
    this.hooks.run.call();
    // 5. 根据配置中的entry找到入口文件
    this.compile((err, stats) => {
      // 10.在确定好输出内容后，根据配置确定输出的路径和文件名、把内容写入到文件系统
      for (let filename in stats.assets) {
        let filePath = path.join(this.options.output.path, filename);
        fs.writeFileSync(filePath, stats.assets[filename], 'utf-8');
      }
      callback(err, {
        toJson: () => stats,
      });
    });
    // 触发done钩子执行
    this.hooks.done.call();

    // 获取每个入口文件 当入口文件发生变化的时候 执行新的编译
    // ['./src/entry1.js', './src/entry2.js']
    Object.values(this.options.entry).forEach((entry) => {
      fs.watchFile(entry, () => this.compile(callback));
    });
  }
  compile(callback) {
    // 创建Complication实例 单例
    let complication = new Compilation(this.options);
    // 调用每个Complication实例去编译模块
    complication.build(callback);
  }
}

module.exports = Compiler;
