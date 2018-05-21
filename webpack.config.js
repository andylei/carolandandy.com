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
    new CleanWebpackPlugin(['dist'])
  ].concat(PAGES.map((p) => new WebPlugin({
    template: `./src/${p}.html`,
    filename: `${p}.html`,
    requires: [p]
  }))),
  resolve: {
    alias: {
      "TweenLite": path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
      "TweenMax": path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      "TimelineLite": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      "TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      "ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      "animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js')
    }
  },
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
