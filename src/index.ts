import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import logger from './utils/logging';
import { cors, tryAuth, injectContext, version } from './middleware';
import router from './controllers';

const app = new Koa();

// todo: node clustering, to be able to utilize all cores

app
  .use(version)
  .use(bodyParser())
  .use(cors)
  .use(injectContext)
  .use(tryAuth)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT, () =>
    logger.info(`Listening on 0.0.0.0:${process.env.PORT}`)
  );

process.on('SIGTERM', () => {
  logger.info('Shutting down gracefully...(SIGTERM)');
  process.exit(0);
});
