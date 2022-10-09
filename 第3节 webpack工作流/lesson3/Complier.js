let { SyncHook } = require('tapable');


/**
 * Complier是编译大管家: 负责整个编译过程, 保存着整个编译所有的信息
 */
class Complier {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 会在开始编译的时候触发
            done: new SyncHook(), // 会在结束编译的时候触发
        }
    }
    // 4. 执行Complier对象的run方法
    run(callback) {
        this.hooks.run.call();
    }
}

module.exports = Complier;