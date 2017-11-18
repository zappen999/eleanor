import { Context, Middleware } from 'koa';
import * as Router from 'koa-router';
import env from '../env';
import {
  graphqlKoa,
  graphiqlKoa
} from 'apollo-server-koa';
import { schema } from '../graphql/schema';
import ContextFactory from '../context-factory';

const router = new Router();

if (env.isDev()) {
  router.get('/', graphiqlKoa({ endpointURL: '/v1/graphql' }));
}

router.post('/', async function(ctx: Context, next: Middleware) {
  await graphqlKoa({
    schema,
    context: ctx.state.contextFactory as ContextFactory,
  })(ctx, next);
});

export default router;
