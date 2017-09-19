const path = require('path');
const webpack = require('webpack');

const rules = [
  {
    test: /\.html$/,
    loader: 'html-loader'
  },
  {
    test: /\.css$/,
    loaders: ['raw-loader']
  },
  {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file-loader'
  },
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader', 'angular-router-loader', 'angular2-template-loader'
    ]
  }
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => module.context && /node_modules/.test(module.context)
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.resolve(__dirname, './notfound'))
];

if (process.env.NODE_ENV === 'production') {
  console.log('Building for production');
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      parallel: {
        cache: true,
        workers: 2
      }
    })
  );
} else {
  console.log('Running in development mode!');
}

module.exports = {
  cache: true,
  context: __dirname,
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    stats: {
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      errors: true,
      errorDetails: false,
      hash: false,
      timings: false,
      modules: false,
      warnings: false
    },
    publicPath: '/build/',
    port: 8080
  },
  entry: {
    app: ['zone.js/dist/zone', './app/main.ts']
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: '/build/',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'app',
      'node_modules'
    ]
  },
  plugins
};
