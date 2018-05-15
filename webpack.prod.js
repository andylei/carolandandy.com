const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(config, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyWebpackPlugin([
      {from: './src/rsvp-index.html', to: './RSVP/index.html'}
    ])
  ]
});
