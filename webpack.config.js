const _ = require('lodash');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');

const PAGES = [
  'index',
  'story',
  'logistics',
  'photos',
  'party'
]

module.exports = {
  entry: _.zipObject(
    PAGES,
    PAGES.map((p) => `./src/${p}.js`)
  ),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ].concat(PAGES.map((p) => new WebPlugin({
    template: `./src/${p}.html`,
    filename: `${p}.html`,
    requires: [p]
  }))),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader"
      },
      {
        test: /\.(html)$/,
        use: [
          'html-loader'
        ]
      }
    ]
  }
};
