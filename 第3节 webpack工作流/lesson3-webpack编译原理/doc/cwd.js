let path = require('path');
function toUnixPath(filePath) {
  debugger;
  return filePath.replace(/\\/g, '/');
}
let baseDir = toUnixPath(process.cwd());
console.log('baseDir', baseDir); // D:\project\webpack5.0\第3节 webpack工作流\lesson3\doc

let depModulePath = toUnixPath(__filename);
console.log(depModulePath); // D:\project\webpack5.0\第3节 webpack工作流\lesson3\doc\cwd.js

// 这样转由于分隔符是有问题的所以是不成功的 posix支持的是 /
console.log('./' + path.posix.relative(baseDir, depModulePath));
