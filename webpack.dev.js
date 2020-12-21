const path = require('path');
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
module.exports = merge(common, {
  mode: "development", // "production" | "development" | "none"
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 8080,
    open: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  }
});