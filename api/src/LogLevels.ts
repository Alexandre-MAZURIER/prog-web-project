import { LogLevel } from '@nestjs/common/services/logger.service';

export const getLogLevels = (isProduction: boolean): Array<LogLevel> => {
  if (isProduction) {
    return ['log', 'error', 'warn', 'debug'];
  }
  return ['log', 'error', 'warn', 'debug', 'verbose'];
};
