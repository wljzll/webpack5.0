const fs = require('fs');
const path = require('path');
const types = require('babel-types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

// 根目录就是当前的工作目录 process.cwd()是指在哪个目录下运行的脚本 cwd就指哪个路径
// 我们运行脚本肯定都得在项目根目录下才行
let baseDir = toUnixPath(process.cwd()); // D:/project/webpack5.0/第3节 webpack工作流/lesson3
// filePath: 路径 将路径里的\路径分隔符统一成 /
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

class Compilation {
  constructor(options) {
    this.options = options;
    this.modules = []; // 本次编译产出的所有模块 所有入口产出的模块
    this.chunks = [];  // 代码块的数组
    this.entrypoints = new Map(); // 入口的数组
    this.assets = {}; // 产出的模块
    this.files = [];
  }
  // 这个才是编译最核心的方法
  build(callback) {
    // 5. 根据配置中的entry找到入口文件
    let entry = {};
    // entry是字符串 单入口
    if (typeof this.options.entry === 'string') {
      // 默认入口做成main
      entry.main = this.options.entry;
    } else {
      // 是对象的话 就配置了入口的键 复用就行
      entry = this.options.entry;
    }

    // 获取当前的工作目录D:\project\webpack5.0\第3节 webpack工作流\lesson3\
    let context =
      (this.options.context && toUnixPath(this.options.context)) ||
      toUnixPath(process.cwd());

    // 6. 从入口文件触发调用所有配置的Loader对模块进行编译
    for (let entryName in entry) {
      // 找到入口文件的绝对路径 d:/project/webpack5.0/第3节 webpack工作流/lesson3/src/entry1.js
      let entryFilePath = path.posix.join(context, entry[entryName]);
      // 调用buildModule方法对入口模块进行处理
      let entryModule = this.buildModule(entryName, entryFilePath);
      // 8. 根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的Chunk
      let chunk = {
        name: entryName, // 代码块的名字就是入口的名字
        entryModule,
        modules: this.modules.filter(item => item.name === entryName),
      }
      this.chunks.push(chunk);
      this.entrypoints.set(entryName, {name: entryName, chunks: [entryName]});
    }

    // 9. 再把每个chunk转换成一个单独的文件加入到输出列表
    this.chunks.forEach(chunk => {
      let filename = this.options.output.filename.replace('[name]', chunk.name);
      this.assets[filename] = getSource(chunk);
    })
    this.files = Object.keys(this.assets);
    // 10.在确定好输出内容后，根据配置确定输出的路径和文件名、把内容写入到文件系统
    callback(null, {
      entrypoints: this.entrypoints,
      chunks: this.chunks,
      modules: this.modules,
      files: this.files,
      assets: this.assets,
    });
  }
  // name: 此模块是属于哪个入口的; modulePath 模块的绝对路径
  buildModule(name, modulePath) {
    // 读取模块内容
    let sourceCode = fs.readFileSync(modulePath, 'utf8');
    // 解构出配置的loader规则
    let { rules } = this.options.module;
    let loaders = [];
    // 遍历loader配置 取出匹配的loader
    rules.forEach((rule) => {
      // 解构出test
      let { test } = rule;
      if (modulePath.match(test)) {
        // 如果模块和正则匹配 收集loader
        loaders.push(...rule.use);
      }
    }); // 收集完成 [logger1, logger2]

    // 将源代码按照倒叙的方式交给loader以此处理
    sourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, sourceCode);
    // 当前入口模块的模块ID
    let moduleId = './' + path.posix.relative(baseDir, modulePath);
    let module = { id: moduleId, dependencies: [], name }; // 这里无论是入口模块还是依赖模块产出的module的name都是入口模块的entryName 这样在组装chunk时就可以筛选出入口模块依赖的模块
    // 7. 再找出该模块依赖的模块 再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
    // 将源代码解析成抽象语法树
    let ast = parser.parse(sourceCode, { sourceType: 'module' });

    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          // 获取依赖模块的相对路径 webpack打包后不管什么模块，模块ID都是相对于根目录的相对路径 ./src ./node_modules
          let depModuleName = node.arguments[0].value; // './title'
          // 获取当前模块所在的目录 并将路径分隔符统一转成 /
          let dirname = path.posix.dirname(modulePath); // d:/project/webpack5.0/第3节 webpack工作流/lesson3/src
          console.log('modulePath', dirname);
          // D:\project\webpack5.0\第3节 webpack工作流\lesson3\src\title
          let depModulePath = path.posix.join(dirname, depModuleName);
          // 获取配置的扩展名
          let extensions = this.options.resolve.extensions;
          // 如果导入的时候没加后缀，尝试加上后缀去获取文件路径
          depModulePath = tryExtensions(depModulePath, extensions);
          // 生成模块ID ./src/title.js
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
          // 修改语法树中的文件路径
          node.arguments = [types.stringLiteral(depModuleId)]; // ./title => ./src/title.js
          console.log('depModuleId', depModuleId);
          // 把此模块依赖的模块ID和模块路径放到此模块的依赖数组中
          module.dependencies.push({
            depModuleId,
            depModulePath,
          });
        }
      },
    });

    let {code} = generator(ast); // 将改造后的语法树重新生成代码
    module._source = code; // module._source指向生成后的代码
    // 7.再递归本步骤直到所有入口依赖的文件都经过本步骤的处理 - 处理依赖的模块
    module.dependencies.forEach(({depModuleId, depModulePath}) => {
      let depModule =  this.buildModule(name, depModulePath);
      this.modules.push(depModule);
    })
    return module;
  }
}

function tryExtensions(modulePath, extensions) {
  // extensions.unshift('');
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  // 遍历所有的文件后缀
  for (let i = 0; i < extensions.length; i++) {
    // 加上文件后缀获取完整的路径
    let filePath = modulePath + extensions[i];
    console.log('filePath', modulePath, filePath);
    // 看这个文件是否存在
    if (fs.existsSync(filePath)) {
      // 存在则返回
      return filePath;
    }
  }
  // 所有的后缀名都找了也没找到就报错了
  throw new Error(`${modulePath}没找到`);
}

function getSource(chunk) {
  return `
  (() => {
    var modules = {
      ${chunk.modules.map((module) => `
        "${module.id}": (module) => {
          ${module._source}
        },
      `)}
    };
    var cache = {};
    function require(moduleId) {
      var cacheModule = cache[moduleId];
      if(cacheModule !== undefined) {
        return cacheModule.exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.export, require);
      return module.exports;
    }
    var exports = {};
    ${chunk.entryModule._source}
  })();
  `
}

module.exports = Compilation;
