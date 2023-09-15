/**
 * 插件的格式: 每个插件都是一个类并且提供一个apply方法
 */
 class DonePlugin {
    apply(complier) {
        complier.hooks.done.tap('DonePlugin', () => {
            console.log('done: 结束编译');
        })
    }
}

module.exports = DonePlugin;
