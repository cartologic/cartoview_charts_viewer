const path = require('path');
const webpack = require('webpack');
const APP_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'dist');
module.exports = {
  context: APP_DIR,
  entry: {

    start: path.join(APP_DIR, 'index.jsx'),
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js',
  },
  plugins: [],
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.xml$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|otf|ttf|eot|woff)$/,
        loader: 'file-loader',
        query: {
          useRelativePath: process.env.NODE_ENV === "production"
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
    ],
    noParse: [/dist\/ol\.js/, /dist\/jspdf.debug\.js/]
  }
};
