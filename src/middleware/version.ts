import { Context, Middleware } from 'koa';
import config from '../config';

// Provide server version in response headers
export async function version(ctx: Context, next: () => Promise<any>) {
  ctx.set('X-Server-Version', config.app.version);
  return await next();
}
