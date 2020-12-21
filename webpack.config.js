const path = require('path');
module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/assets/", // string
  }
};