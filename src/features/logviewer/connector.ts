import { LogEntry, LogQueryOptions } from './factory';
import logger from '../../utils/logging';

export interface ILogviewerConnector {
  getLogs(options: LogQueryOptions): Promise<Array<LogEntry>>;
}

export enum LogLevels {
  error = 0,
  warn = 1,
  info = 2,
  verbose = 3,
  debug = 4,
  silly = 5,
}

export type QueriedLogEntry = {
  timestamp: string;
  level: LogLevels;
  message: string;
  [key: string]: any;
}

export class LogviewerConnector implements ILogviewerConnector {
  getLogs(options: LogQueryOptions): Promise<Array<LogEntry>> {
    return new Promise<Array<LogEntry>>((resolve, reject) => {
      // todo: read from winston logging deamon via network instead.
      // ^ when implementing clustering
      logger.query(options, (err, data) => {
        if (err) {
          return reject(err);
        }

        const baseKeys = ['timestamp', 'level', 'message'];

        let result = data.file;

        if (options.minLevel) {
          result = result.filter((row: QueriedLogEntry) => 
            LogLevels[row.level.toString()] <= LogLevels[options.minLevel]
          );
        }

        // todo: search meta-data aswell, switch for more sophisticated
        // search engine (fuzzy)
        if (options.search) {
          result = result
            .filter(row => row.message.toLowerCase()
              .indexOf(options.search.toLowerCase()) > -1);
        }

        return resolve(result.map(row => {
          const keys = Object.keys(row);
          const metaKeys= keys.filter(key => baseKeys.indexOf(key) === -1);
          const metaData = metaKeys.reduce((acc: object, key: string) => {
            acc[key] = row[key];
            return acc;
          }, {});

          return {
            createdAt: row.timestamp,
            level: row.level,
            message: row.message,
            meta: metaData,
          } as LogEntry;
        }));
      });
    });
  }
}
