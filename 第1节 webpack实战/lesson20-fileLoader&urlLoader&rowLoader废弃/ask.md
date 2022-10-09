1、对修饰器的实验支持功能在将来的版本中可能更改。在 "tsconfig" 或 "jsconfig" 中设置 "experimentalDecorators";
```
在项目根目录下创建jsconfig.json文件
{
    "compilerOptions": { // 编译选项
        "experimentalDecorators": true // 此配置项是开启对装饰器模式的编译支持
    }
}
```