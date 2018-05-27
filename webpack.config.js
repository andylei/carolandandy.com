const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PAGES = [
  'index',
  'logistics',
  'photos',
  'party',
  'registry',
  'rsvp',
];

function htmlPlugin(name) {
  return new HtmlWebpackPlugin({
    chunks: [name],
    template: `./src/${name}.html`,
    filename: `${name}.html`,
  });
}

const HTML_PLUGINS = PAGES.map(htmlPlugin);

const ENTRYPOINTS = Object.assign(...PAGES.map(p => ({[p] : `./src/${p}.js`})));

module.exports = {
  entry: ENTRYPOINTS,
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 9000,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    ...HTML_PLUGINS
  ],
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
        test: /\.(html)$/,
        use: [
          'html-loader'
        ]
      },
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
      }
    ]
  }
}