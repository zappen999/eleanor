import * as winston from 'winston';
import env from '../env';


// todo: break out file-logging to logging to a winstond server, to allow for
// concurrency/clustering
export default new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      level: env.isDev() ? 'silly' : 'warn',
      colorize: true,
    }),
    new (winston.transports.File)({
      level: 'debug',
      filename: process.env.APP_LOG || '/dev/null', // todo: read from config
    }),
  ],
})
