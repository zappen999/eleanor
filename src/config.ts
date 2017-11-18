const pkg = require('../package.json');

export interface Config {
  app: {
    name: string;
    version: string;
  },
  auth: {
    ttl: string;
    secret: string;
  }
}

const config : Config = {
  app: {
    name: pkg.name,
    version: pkg.version,
  },
  auth: {
    ttl: '24h',
    secret: 'qwerty', // todo: something random
  }
};

export default config;
