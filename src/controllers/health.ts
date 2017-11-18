import { Context, Middleware } from 'koa';
import * as Router from 'koa-router';

const router = new Router();

// handle health checks
// todo: business-critical health-checks here later on
router.get('/', async function(ctx: Context, next: Middleware) {
  ctx.status = 200;
  ctx.body = 'Up n running';
});

export default router;
