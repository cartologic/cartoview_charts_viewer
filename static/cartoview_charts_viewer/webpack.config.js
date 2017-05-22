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
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
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
        test: /\.(png|gif|jpg|jpeg|svg|otf|ttf|eot|woff|xml)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ],
    noParse: [/dist\/ol\.js/, /dist\/jspdf.debug\.js/]
  }
};
