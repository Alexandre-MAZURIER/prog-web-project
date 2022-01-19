import { Controller, Get } from '@nestjs/common';
import { GasService } from './gas.service';

@Controller('gas')
export class GasController {
  constructor(private readonly gasService: GasService) {}

  @Get('daily-data')
  getDailyData(): Promise<void> {
    return this.gasService.getDailyData();
  }
}
