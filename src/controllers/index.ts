import * as Router from 'koa-router';
import gqlRouter from './graphql';
import healthRouter from './health';
import logviewerRouter from './logviewer';

const router = new Router();

// new controllers goes here
router
  .use('/v1/graphql', gqlRouter.routes(), gqlRouter.allowedMethods())
  .use('/v1/health', healthRouter.routes(), healthRouter.allowedMethods())
  .use('/v1/logviewer', logviewerRouter.routes(), logviewerRouter.allowedMethods());

export default router;
