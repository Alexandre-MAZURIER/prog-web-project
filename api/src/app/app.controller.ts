import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root Service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  @ApiOkResponse({ description: 'The service is up.' })
  getStatus(): string {
    return this.appService.getStatus();
  }
}
