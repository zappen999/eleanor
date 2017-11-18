import { Context } from 'koa';
import env from '../env';

/**
 * Handle Cross Origin Resource Sharing (CORS)
 */
export async function cors(ctx: Context, next: () => Promise<any>) {
  if (env.isDev()) {
    ctx.set('Access-Control-Allow-Origin', '*');
  }

  if (ctx.request.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  await next();
}
