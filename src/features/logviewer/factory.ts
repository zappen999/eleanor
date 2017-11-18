import { QueryOptions, NPMLoggingLevel } from 'winston';
import { ILogviewerConnector } from './connector';

export type LogEntry = {
  createdAt: string;
  level: string;
  message: string;
  meta?: any;
}

export type LogQueryOptions = QueryOptions & {
  search?: string;
  minLevel?: NPMLoggingLevel;
}

const defaultQuery: LogQueryOptions = {
  start: 0,
  limit: 100,
  rows: 100,
  // todo: change to desc when changing from winston file transport, or
  // winston fixes the issue with sorting asc/desc correctly
  order: 'asc',
  from: new Date((Date.now() - (24 * 60 * 60 * 1000))), // last day
  until: new Date(),
  fields: undefined, // all fields
};

export class LogviewerFactory {
  private connector: ILogviewerConnector

  constructor(connector: ILogviewerConnector) {
    this.connector = connector;
  }

  getLogs(options: LogQueryOptions): Promise<Array<LogEntry>> {
    const queryOptions = Object.assign(defaultQuery, options, {
      // since winston seems to save limit as 'rows'
      rows: options.limit || defaultQuery.limit
    });
    return this.connector.getLogs(queryOptions);
  }
}
