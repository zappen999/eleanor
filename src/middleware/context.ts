import { Context } from 'koa';
import ContextFactory from '../context-factory';

export async function injectContext(ctx: Context, next: () => Promise<any>) {
  ctx.state.contextFactory = new ContextFactory();
  return await next();
}
