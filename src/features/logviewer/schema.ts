import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';

const LogEntry = `
  scalar DateTime
  scalar JSON

  enum Level {
    error
    warn
    info
    verbose
    debug
    silly
  }

  type LogEntry {
    createdAt: DateTime
    level: Level
    message: String
    meta: JSON
  }
`;

export const types = () => [LogEntry];
export const resolvers = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
};
