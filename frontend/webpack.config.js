const path = require('path');

module.exports = {
  // mode defaults to 'production' if not set
  mode: 'development',

  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // add source maps
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          // without additional settings, this will reference the .babelrc
          loader: 'babel-loader',
        },
      },
    ],
  },

  // removes the requirement to add the .jsx extension when importing
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  // used for webpack-dev-server
  devServer: {
    contentBase: './dist',
    port: 8081,
    proxy: { '/api/**': { target: 'http://localhost:3001', secure: false } },
    historyApiFallback: true,
  },
};
