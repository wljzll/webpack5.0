import { flatten, concat } from 'lodash'; // 这种导入方法的语法树的导入源是lodash整个包

// 这种导入方法是从lodash的子包中导入
// import flatten from 'lodash/flatten';
// import concat from 'lodash/concat';

console.log(flatten, concat);