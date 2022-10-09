import './index.css';
import './less.less';
import './sass.scss';

let jQuery = require('jquery'); // 如果配置了external这个语句会解析成 let jQuery = window.jQuery;

console.log(jQuery);