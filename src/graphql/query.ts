import ContextFactory from '../context-factory';
import { LogQueryOptions } from '../features/logviewer/factory';

import {
  types as authTypes,
  resolvers as authResolvers,
  AuthIdentity
} from '../features/auth';

import {
  types as logviewerTypes,
  resolvers as logviewerResolvers,
  LogEntry
} from '../features/logviewer';

const Query = `
  scalar Date

  type Query {
    # Current authenticated identity, based on provided token
    authIdentity: AuthIdentity

    logs(
      search: String
      minLevel: Level
      from: String
      until: String
      start: Int
      limit: Int
    ): [LogEntry]
  }
`;

async function authIdentity(
  root,
  args,
  ctx: ContextFactory
): Promise<AuthIdentity> {
  return ctx.authFactory.getCurrentIdentity();
}

async function logs(
  root,
  args: LogQueryOptions,
  ctx: ContextFactory
): Promise<Array<LogEntry>> {
  return ctx.logviewerFactory.getLogs(args);
}

export const resolvers = Object.assign({
  Query: {
    authIdentity,
    logs,
  },
}, authResolvers, logviewerResolvers);

export const types = () => [Query, authTypes, logviewerTypes];
