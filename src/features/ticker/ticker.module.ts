import { Module } from '@nestjs/common';
import { TickerController } from './ticker.controller';
import { TickerService } from './ticker.service';

@Module({
  controllers: [TickerController],
  providers: [TickerService],
})
export class TickerModule {}
