import { Context, Middleware } from 'koa';
import * as Router from 'koa-router';
import * as serve from 'koa-static';
import * as mount from 'koa-mount';

const router = new Router();

router.get('/(.*)', async (ctx: Context, next: () => Promise<any>) => {
  // todo: fix this ugly mount
  const logviewerStatic = '/home/node/app/src/features/logviewer/static';

  return mount('/v1/logviewer', serve(logviewerStatic))(ctx, next); 
});

export default router;
