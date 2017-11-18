import { Context } from 'koa';
import ContextFactory from '../context-factory';
import * as serve from 'koa-static';
import * as mount from 'koa-mount';
import env from '../env';

// todo: protect this route
export async function logviewer(ctx: Context, next: () => Promise<any>) {
  next

}
