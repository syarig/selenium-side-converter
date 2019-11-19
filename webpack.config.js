const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /\/log4js\//,
      (data) => {
        delete data.dependencies[0].critical;
        return data;
      },
    ),
  ]
};