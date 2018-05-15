const _ = require('lodash');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');

const PAGES = [
  'index',
  'story',
  'logistics',
  'photos',
  'rsvp',
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
    contentBase: './dist',
    port: 9000
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new WebPlugin({
      template: `./src/rsvp-index.html`,
      filename: 'RSVP/index.html'
    })
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
