// 路径分割符: window \  linux /

let path = require('path');
console.log(path.sep); // windows环境是 \ linux是 /

// 为了保持统一
console.log(path.posix.sep); // 这个属性无论是windows还是linux环境都是/
