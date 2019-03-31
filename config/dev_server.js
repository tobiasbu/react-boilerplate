import * as path from 'path';
import express from 'express';
import webpack from 'webpack';
import ip from 'ip';
const opn = require('opn');

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config';

const DIST_PATH = path.resolve(__dirname, '../dist');
const PORT = parseInt(process.env.PORT, 10) || 3000;
let HOST = 'localhost';

if (process.argv.length > 0) {
  process.argv.forEach(arg => {
    const splitedArg = arg.split('=');
    switch (splitedArg[0]) {
      default:
        break;
      case '--host': {
        if ('local-net') {
          HOST = ip.address();
        } else {
          HOST = splitedArg[1];
        }
      }
    }
  });
}


const compiler = webpack(config({ PORT, HOST, prod: false }));

const devMiddlewareConfig = {
  quiet: false,
  reload: true,
  overlay: true,
  noInfo: true,
  publicPath: null,
}

const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareConfig);
const hotMiddleware = webpackHotMiddleware(compiler);

const app = express();

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use(devMiddleware);
app.use(hotMiddleware);

app.use(express.static(DIST_PATH));

console.log("Dist Path: " + DIST_PATH)

const server = app.listen(PORT, HOST, (error) => {

  if (error) {
    return console.error(error);
  }

  opn(`http://${HOST}:${PORT}`, { app: 'chrome' }).then((c) => {
    console.log('Chrome PID ' + c.pid);
  }).catch((e) => {
    console.error('Could not open Chrome Browser.', e);
  })

  console.log(`\n\nDev server listening on port ${PORT} at ${HOST}: \n\n`);
})

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  devMiddleware.close();
  server.close(() => {
    process.exit(0);
  });
});