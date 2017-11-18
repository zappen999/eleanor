import { Middleare } from 'koa';

declare module 'koa-graphiql' {
  declare function Graphiql(any): Middleware;

  export = Graphiql;
}

