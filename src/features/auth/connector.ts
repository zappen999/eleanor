import { IAuthConnector, AuthIdentity, Identity, Grant } from './factory';
import * as jwt from 'jsonwebtoken';
import config from '../../config';

// todo: in-memory db until we know which database engine/structure we want
const identities: Array<Identity> = [];

export type TokenData = {
  id: string;
  grants: Array<Grant>;
}

export class AuthConnector implements IAuthConnector {
  async authenticate(id: string, password: string): Promise<AuthIdentity> {
    // todo: replace with real mechanism to authenticate this identity
    const identity = identities
      .find(i => i.id === id && i.password === password);

    if (!identity) {
      throw new Error('Invalid id or password');
    }

    // user was authenticated correctly, sign a token

    const tokenData = {
      id: identity.id,
      grants: []
    } as TokenData;
    const token = await this.signJWT(
      tokenData,
      config.auth.ttl,
      config.auth.secret
    );

    return {
      id: identity.id,
      token
    } as AuthIdentity;
  }

  authorize(token: string): Promise<AuthIdentity> {
    return this.verifyJWT(token, config.auth.secret);
  }

  // todo: implement real register funtionality
  async register(id: string, password: string): Promise<AuthIdentity> {
    identities.push({
      id,
      password,
    } as Identity);

    return this.authenticate(id, password);
  }

  protected async verifyJWT(
    token: string,
    secret: string
  ): Promise<AuthIdentity> {
    return new Promise<AuthIdentity>((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded: AuthIdentity) => {
        if (err) {
          return reject(err);
        }

        decoded.token = token;
        return resolve(decoded);
      });
    });
  }

  protected async signJWT(
    data: TokenData,
    expiresIn: string,
    secret: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(data, secret, { expiresIn }, (err, token) => {
        if (err) {
          return reject(err);
        }

        return resolve(token);
      });
    });
  }

  async loadBatch(ids: Array<string>): Promise<any> {
    return [];
  }
}
