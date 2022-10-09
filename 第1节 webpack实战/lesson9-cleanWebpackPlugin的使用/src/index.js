require('./index.css');
import './less.less';
import './sass.scss';

let avatar = require('./images/cat.webp');
let img = new Image();
// 打包成ES6模块取法
// img.src = avatar.default;

// 非ES6模块取法
img.src = avatar;
document.body.appendChild(img);
