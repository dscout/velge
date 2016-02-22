module.exports = {
  entry: './src/index.js',
  output: {
    filename: './js/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    port: 4040
  }
};
