import { Logger as BoltLogger, LogLevel as BoltLogLevel } from '@slack/logger';
import { Logger as PinoLogger, Level as PinoLogLevel } from 'pino';

// boltLogLevelToPinoLogLevel converts slack bolt-js log levels to pino log levls
export const boltLogLevelToPinoLogLevel = (
  level: BoltLogLevel,
): PinoLogLevel => {
  switch (level) {
    case BoltLogLevel.DEBUG:
      return 'debug';
    case BoltLogLevel.INFO:
      return 'info';
    case BoltLogLevel.WARN:
      return 'warn';
    case BoltLogLevel.ERROR:
      return 'error';
    default:
      return 'info';
  }
};

// pinoLogLevelToBoltLogLevel converts strings (presumably matching pino levels)
export const pinoLogLevelToBoltLogLevel = (level: string): BoltLogLevel => {
  switch (level) {
    case 'trace':
      return BoltLogLevel.DEBUG;
    case 'debug':
      return BoltLogLevel.DEBUG;
    case 'info':
      return BoltLogLevel.INFO;
    case 'warn':
      return BoltLogLevel.WARN;
    case 'error':
      return BoltLogLevel.ERROR;
    case 'fatal':
      return BoltLogLevel.ERROR;
    case 'silent':
      return BoltLogLevel.DEBUG;
    default:
      return BoltLogLevel.INFO;
  }
};

// slack bolt-js custom loggers must implement this Logger interface:
//   setLevel()	level: LogLevel	void
//   getLevel()	None	string with value error, warn, info, or debug
//   setName()	name: string	void
//   debug()	...msgs: any[]	void
//   info()	...msgs: any[]	void
//   warn()	...msgs: any[]	void
//   error()	...msgs: any[]	void
// see: https://github.com/slackapi/bolt-js/blob/main/docs/_advanced/logging.md
export const PinoSlackBoltLogger = (logger: PinoLogger): BoltLogger => {
  let innerLevel = pinoLogLevelToBoltLogLevel(logger.level);
  let innerLogger = logger;

  return {
    setLevel: (level: BoltLogLevel) => {
      // TODO: is this possible with pino?
      //       does this mean adjust min level?
      innerLevel = level;
    },
    getLevel: () => {
      return innerLevel;
    },
    setName: (name: string) => {
      innerLogger = innerLogger.child({ name });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: (...msg: any[]) => {
      if (msg.length < 0) {
        return;
      } else if (msg.length == 1) {
        innerLogger.debug(msg[0]);
      } else if (msg.length > 1) {
        innerLogger.debug({ data: msg.slice(1) }, msg[0]);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (...msg: any[]) => {
      if (msg.length < 0) {
        return;
      } else if (msg.length == 1) {
        innerLogger.info(msg[0]);
      } else if (msg.length > 1) {
        innerLogger.info({ data: msg.slice(1) }, msg[0]);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (...msg: any[]) => {
      if (msg.length < 0) {
        return;
      } else if (msg.length == 1) {
        innerLogger.warn(msg[0]);
      } else if (msg.length > 1) {
        innerLogger.warn({ data: msg.slice(1) }, msg[0]);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (...msg: any[]) => {
      if (msg.length < 0) {
        return;
      } else if (msg.length == 1) {
        innerLogger.error(msg[0]);
      } else if (msg.length > 1) {
        innerLogger.error({ data: msg.slice(1) }, msg[0]);
      }
    },
  };
};
