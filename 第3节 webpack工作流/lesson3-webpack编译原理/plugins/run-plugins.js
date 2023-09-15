/**
 * 插件的格式: 每个插件都是一个类并且提供一个apply方法
 */
class RunPlugin {
    apply(complier) {
        complier.hooks.run.tap('RunPlugin', () => {
            console.log('run: 开始编译');
        })
    }
}

module.exports = RunPlugin;