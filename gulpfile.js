/* eslint-disable require-jsdoc */
const gulp = require('gulp');
const babel = require('gulp-babel');
const babelOpts = require('./scripts/babel/default-options');
const del = require('del');
const header = require('gulp-header');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const webpackStream = require('webpack-stream');

const DEVELOPMENT_HEADER = [
  '/**',
  ' * Emitter v<%= version %>',
  ' */',
].join('\n') + '\n';
const PRODUCTION_HEADER = [
  '/**',
  ' * Emitter v<%= version %>',
  ' *',
  ' * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.',
  ' *',
  ' * This source code is licensed under the BSD-style license found in the',
  ' * LICENSE file in the root directory of this source tree. An additional grant',
  ' * of patent rights can be found in the PATENTS file in the same directory.',
  ' */',
].join('\n') + '\n';

const paths = {
  dist: './dist/',
  lib: 'lib',
  entry: './index.js',
  entryUtils: './utils.js',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};
const currentVersion=require('./package.json').version;

const buildDist = function(opts) {
  const webpackOpts = {
    debug: opts.debug,
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel'},
      ],
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: opts.library,
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        ),
      }),
    ],
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
        new webpackStream.webpack.optimize.UglifyJsPlugin({
          compress: {
            hoist_vars: true,
            screw_ie8: true,
            warnings: false,
          },
        })
    );
  }
  return webpackStream(webpackOpts, null, function(err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
    }
  });
};

function clean() {
  return del([paths.lib]);
};

function libs() {
  return gulp
      .src(paths.src)
      .pipe(flatten())
      .pipe(gulp.dest(paths.lib));
};

async function distDefault() {
  const distOpts = {
    debug: true,
    output: 'Emitter.js',
    library: 'Emitter',
  };
  return gulp.src(paths.entry)
      .pipe(buildDist(distOpts))
      .pipe(header(DEVELOPMENT_HEADER, {
        version: currentVersion,
      }))
      .pipe(gulp.dest(paths.dist));
}

const build = gulp.series(
    clean,
    libs
);

exports.clean = clean;
exports.libs = libs;
exports.build = build;
exports.distDefault = distDefault;
exports.default = build;
