## CSS兼容性处理

### 1、css-loader是用来翻译处理 @import和url的
### 2、style-loader可以把CSS插入DOM中

### 3、loader配置规则
```
1、配置文件中use的意思是使用哪些loader进行转换
2、loader的执行顺序是从右向左，从下向上
3、最右边的loader接收源文件，最左侧的loader返回一个JS脚本
```