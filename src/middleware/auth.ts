import { Context } from 'koa';
import ContextFactory from '../context-factory';

// Tries to authorize this request. It's up the the next middleware
// to decide what to do in unauthorized cases.
export async function tryAuth(ctx: Context, next: () => Promise<any>) {
  const token = ctx.get('Authorization');

  if (!token) {
    return await next();
  }

  const contextFactory = ctx.state.contextFactory as ContextFactory;

  try {
    await contextFactory.authFactory.authorize(token);
  } catch (err) {
    return await next();
  }

  return await next();
}
