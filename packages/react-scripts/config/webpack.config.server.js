'use strict';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

const getClientEnvironment = require('./env');
const config = require('./webpack.config.prod');
const paths = require('./paths');

const env = getClientEnvironment();

module.exports = Object.assign({}, config, {
  target: 'node',
  entry: {
    server: paths.appServerJs,
  },
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: paths.servedPath,
  },
  optimization: {
    //using only minimizer option to avoid getting server files split in chunks
    minimizer: config.optimization.minimizer,
  },
  externals: [
    nodeExternals(),
    // this file is available only after build, this way it won't be compiled
    // during server bundling
    './index.html.js',
  ],
  node: Object.assign({}, config.node, {
    __dirname: false,
    __pathname: false,
  }),
  plugins: [
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
});
