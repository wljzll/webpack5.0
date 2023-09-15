/**
 * @description 用来编译各种钩子call方法的类
 *
 *
 */
class HookCodeFactory {
  /**
   *
   * @param {*} hookInstance Hook的实例
   * @param {*} options {taps, args, type}
   */
  setup(hookInstance, options) {
    // 给hook实例添加_x属性 保存的是注册事件的事件函数
    hookInstance._x = options.taps.map((item) => item.fn);
  }
  init(options) {
    // 将选项保存在实例的options的属性上
    this.options = options;
  }
  // 将形参转成形参字符串
  args(options = {}) {
    // 解构属性
    let { before, after } = options;
    // 拿到参数
    let allArgs = this.options.args || [];
    // before存在合并参数
    if (before) allArgs = [before, ...allArgs];
    // after存在合并参数
    if (after) allArgs = [...allArgs, after];
    // 参数长度大于0 将形参数组转成 , 分割的字符串
    if (allArgs.length > 0) return allArgs.join(", ");
    return "";
  }
  // 创建函数体的公共开头部分
  header() {
    let code = "";
    code += "var _x = this._x;\n";
    // 把拦截器的call方法放在函数体里执行
    if (this.options.interceptors.length > 0) {
      code += `var _taps = this.taps;\n`;
      code += `var _interceptors = this.interceptors;\n`;
    }
    // 遍历拦截器
    for (let k = 0; k < this.options.interceptors.length; k++) {
      const interceptor = this.options.interceptors[k];
      // 如果有call方法 调用callf方法
      if (interceptor.call)
        code += `_interceptors[${k}].call(${this.args()});\n`;
    }
    return code;
  }
  // 创建call方法的真实函数
  create(options) {
    // 把options存到HookCodeFactory实例上
    this.init(options);

    let fn;
    // 判断hook类型
    switch (this.options.type) {
      case "sync": // 创建同步调用事件处理函数的方法
        // 创建真正要执行的call函数
        fn = new Function(this.args(), this.header() + this.content());
        break;

      case "async": // 创建异步调用事件处理函数的方法
        fn = new Function(
          this.args({ after: "_callback" }),
          this.header() + this.content({ onDone: () => " _callback();\n" })
        );
        break;

      case "promise":
        let tapsContent = this.content({ onDone: () => " _resolve();\n" });
        // 返回一个Promise
        let content = `return new Promise(function (_resolve, _reject) {
                     ${tapsContent}
                 })`;
        fn = new Function(this.args(), this.header() + content);
        break;
      default:
        break;
    }

    return fn;
  }
  // 编译异步并行hook call方法函数体
  callTapsParallel({ onDone }) {
    // 总的计数次数
    let code = `var _counter = ${this.options.taps.length};\n`;

    code += `var _done = function () {
                          ${onDone()}
                        };
            `;

    for (let j = 0; j < this.options.taps.length; j++) {
      const content = this.callTap(j);
      code += content;
    }
    return code;
  }
  // 编译同步钩子call方法函数体
  callTapsSeries() {
    // 如果没有注册事件
    if (this.options.taps.length === 0) {
      return "";
    }

    let code = "";
    // 遍历注册的事件数组
    for (let j = 0; j < this.options.taps.length; j++) {
      // 生成函数声明和执行函数的字符串
      const content = this.callTap(j);
      code += content;
    }
    // 生成完成 返回
    return code;
  }
  // 生成对应注册事件的事件处理函数执行代码
  callTap(tapIndex) {
    let code = "";
    // 遍历拦截器
    if (this.options.interceptors.length > 0) {
      // 获取注册的事件函数
      code += `var _tap${tapIndex} = _taps[${tapIndex}];`;
      // 遍历拦截器
      for (let i = 0; i < this.options.interceptors.length; i++) {
        let interceptor = this.options.interceptors[i];
        // 拿到tap函数
        if (interceptor.tap) {
          // 执行拦截器的tap函数
          code += `_interceptors[${i}].tap(_tap${tapIndex});`;
        }
      }
    }
    // 生成这个代码: var _fn0 = _x[0];
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    // 拿到对应的事件信息
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      /************** 处理同步钩子 **************/
      case "sync":
        // 生成这个代码: _fn0(name, age);
        code += `_fn${tapIndex}(${this.args()});\n`;
        break;
      /************** 处理异步钩子 **************/
      case "async":
        code += `_fn${tapIndex}(${this.args({
          after: `function (_err${tapIndex}) {
                if (--_counter === 0) _done();
          }`,
        })});`;
        break;
      /************** 处理promise钩子 **************/
      case "promise":
        code = `
                 var _fn${tapIndex} = _x[${tapIndex}];
                 var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                _promise${tapIndex}.then(
                     function () {
                      if (--_counter === 0) _done();
                      }
                  );
              `;
      default:
        break;
    }
    return code;
  }
}

module.exports = HookCodeFactory;
