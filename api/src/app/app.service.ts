import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getStatus(): string {
    this.logger.verbose('#getStatus()');
    return 'OK';
  }
}
