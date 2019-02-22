const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  mode: 'production',
  entry: {
   'index.es5': path.resolve(__dirname, '../package/index.js')
  },
  output:{
    filename: '[name].js',
    path: path.resolve(__dirname, '../lib/'),
    chunkFilename: '[id].js',
    libraryExport: 'default',
    library: 'vue-scroll-mobile',
    libraryTarget: 'umd'
  },
  module: {
    rules:[
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          presets: ["@babel/env"],
          "plugins": [
            "@babel/plugin-transform-runtime",
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}