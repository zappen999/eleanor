import { makeExecutableSchema } from 'graphql-tools';
import {
  types as queryTypes,
  resolvers as queryResolvers
} from './query';
import {
  types as mutationTypes,
  resolvers as mutationResolvers
} from './mutation';

const schemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

const combinedSchemas = [
  schemaDefinition,
  queryTypes,
  mutationTypes,
];

const resolvers = Object.assign({}, queryResolvers, mutationResolvers);

export const schema = makeExecutableSchema({
  typeDefs: combinedSchemas,
  resolvers,
});

