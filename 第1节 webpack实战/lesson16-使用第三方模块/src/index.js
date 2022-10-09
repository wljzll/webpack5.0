// import _ from 'lodash';
// const _ = require('lodash');
// eslint-disable-next-line import/no-webpack-loader-syntax

// main.js:17388 Uncaught Error: [exposes-loader] The "_" value exists in the global scope
let _ = require('expose-loader?exposes=_|override=true!lodash');
console.log(_.join(['a', 'b', 'c', 'd']));
