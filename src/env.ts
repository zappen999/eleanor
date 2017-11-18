export interface Env {
  isProd(): boolean,
  isDev(): boolean,
}

const env : Env = {
  isProd: () => process.env.NODE_ENV === 'production',
  isDev: () => process.env.NODE_ENV === 'development',
};

export default env;
