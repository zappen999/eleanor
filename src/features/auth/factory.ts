import * as DataLoader from 'dataloader';

export interface IAuthConnector {
  authenticate(id: string, password: string): Promise<AuthIdentity>;
  register(id: string, password: string): Promise<AuthIdentity>;
  authorize(token: string): Promise<AuthIdentity>;
  loadBatch(ids: Array<string>): Promise<any>;
}

export type AuthIdentity = {
  id: string;
  token: string;
}

export type Identity = {
  id: string;
  password: string;
}

// todo: implement nicer grants
export type Grant = {
  domain: string,
  actions: Array<string>,
}

export class AuthFactory {
  private connector: IAuthConnector;
  private authIdentity: AuthIdentity;
  private loader;

  constructor(connector: IAuthConnector) {
    this.connector = connector;
    this.loader = new DataLoader(this.connector.loadBatch);
  }

  // Gets the current auth identity if token was provided and valid.
  // Check auth middlware for more details.
  getCurrentIdentity(): AuthIdentity {
    return this.authIdentity;
  }

  authenticate(id: string, password: string): Promise<AuthIdentity> {
    return this.connector.authenticate(id, password);
  }

  register(id: string, password: string): Promise<AuthIdentity> {
    return this.connector.register(id, password);
  }

  async authorize(token: string): Promise<AuthIdentity> {
    if (this.authIdentity) {
      return this.authIdentity;
    }

    try {
      // store the authorization for future use within this request context
      this.authIdentity = await this.connector.authorize(token);
      return this.authIdentity;
    } catch (err) {
      throw err;
    }
  }
}
