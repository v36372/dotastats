'use strict';
var webpack = require('webpack');

const config = {
  cache: true,
  entry: './src/index.js',
  output: {
      path: __dirname + "/dist",
      filename: "main.js"
  },
  module: {
    loaders: [
    { test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['es2015', 'stage-0', 'react'], cacheDirectory: true } },
    { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
    { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  }
};

module.exports = config;
