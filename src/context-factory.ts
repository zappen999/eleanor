import { AuthFactory, AuthConnector } from './features/auth';
import { LogviewerFactory, LogviewerConnector } from './features/logviewer';

export interface IContextFactory {
  authFactory: AuthFactory;
  logviewerFactory: LogviewerFactory;
}

class ContextFactory implements IContextFactory {
  public authFactory: AuthFactory;
  public logviewerFactory: LogviewerFactory;

  constructor() {
    // setup connectors
    const authConnector = new AuthConnector();
    const logviewerConnector = new LogviewerConnector();

    // setup factories
    this.authFactory = new AuthFactory(authConnector);
    this.logviewerFactory = new LogviewerFactory(logviewerConnector);
  }
}

export default ContextFactory
