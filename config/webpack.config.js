import path from 'path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

/**
 * 
 * @param {{PROD:boolean, HOST:string, PORT:number}} env The enviroment options
 * @returns {webpack.Configuration} Webpack configuration
 */
export default function (env) {

  const isProduction = (env.PROD) ? true : false;
  const MODE = (isProduction) ? 'production' : 'development';

  const PROJECT_PATH = path.join(__dirname, '../');
  const SOURCE_PATH = path.join(PROJECT_PATH, "./src");
  const OUTPUT_PATH = (!isProduction) ? path.join(PROJECT_PATH, "./dist") : path.join(PROJECT_PATH, "./build");

  const HOST = env.HOST || 'localhost';
  const PORT = env.PORT || 8080;
  const HOT_MW = `webpack-hot-middleware/client?path=http://${HOST}:${PORT}/__webpack_hmr&reload=true`;

  console.log('Running in mode [' + MODE + ']')

  /**
   * @type {webpack.Configuration}
   */
  const config = {
    context: PROJECT_PATH,
    target: 'web',
    mode: MODE,
    entry: {
      app: (isProduction) ? [path.join(SOURCE_PATH, '/index.js')] : [path.join(SOURCE_PATH, '/index.js'), HOT_MW],
    },
    output: {
      path: OUTPUT_PATH,
      filename: '[name]' + ((isProduction) ? '.js' : '.dev.js'),
      pathinfo: false,
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
    module: {
      rules: [

      ]
    },
    externals: {
      "React": "React",
      "ReactDOM": "ReactDOM"
    },
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,
      __filename: false
    },
    plugins: [],
  }

  // default plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: 'react-dom',
    }),
    new CopyPlugin([
      { from: path.join(PROJECT_PATH, "./static"), to: OUTPUT_PATH, ignore: ['*.html'] },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(PROJECT_PATH, "./static/index.html"),
      cache: true,
    })
  );

  if (isProduction) {
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          safari10: true,
        },
      })
    ]

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: './css/[name].css',
      }),
      // new OptimizeCSSAssetsPlugin({
      //   cssProcessor: cssnano,
      //   cssProcessorOptions: {
      //     discardComments: {
      //       removeAll: true,
      //     },
      //   },
      //   canPrint: false,
      // }),
    );

  } else {
    config.devtool = 'source-map';
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin({ multiStep: false }), // enable HMR globally
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.ProvidePlugin({
        React: "react",
        ReactDOM: 'react-dom',
      }),
    )
  }


  return config;

} 