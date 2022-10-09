let { SyncHook } = require('tapable');
console.log(SyncHook);

// 创建SyncHook实例
let hook = new SyncHook(['name']);
// 注册一个事件
hook.tap('click', (name) => {
    console.log('clicked', name);
})
hook.tap('test', (name) => {
    console.log('tested', name);
})
// 触发事件
hook.call('zhufeng');