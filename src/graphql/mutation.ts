import ContextFactory from '../context-factory';

const Mutation = `
  type Mutation {
    authenticate(
      # Identifier for the identity, can be email, username etc.
      id: String!
      # Password for the identity
      password: String!
    ): AuthIdentity

    register(
      # Identifier for the identity, can be email, username etc.
      id: String!
      # Password for the identity
      password: String!
    ): AuthIdentity
  }
`;

type AuthenticateArgs = {
  id: string;
  password: string;
}

type RegisterArgs = AuthenticateArgs & {}

async function authenticate(
  root,
  args: AuthenticateArgs,
  ctx: ContextFactory
): Promise<any> {
  return ctx.authFactory.authenticate(args.id, args.password);
}

async function register(
  root,
  args: RegisterArgs,
  ctx: ContextFactory
): Promise<any> {
  return ctx.authFactory.register(args.id, args.password);
}

export const types = () => [Mutation];
export const resolvers = {
  Mutation: {
    authenticate,
    register,
  },
};
