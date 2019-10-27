const assign = require('object-assign');
const babel = require('babel-core');
const babelOpts = require('../babel/default-options');


module.exports = {
  process: function(src, path) {
    // TODO: Use preprocessorIgnorePatterns when it works.
    // See https://github.com/facebook/jest/issues/385.
    if (!path.match(/\/node_modules\//) && !path.match(/\/third_party\//)) {
      return babel.transform(src, assign({filename: path}, babelOpts)).code;
    }
    return src;
  },
};
