import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpTickerService } from './http-ticker.service';
import { SymbolSchema, TickerSchema } from './ticker-schema';
import { TickerController } from './ticker.controller';
import { TickerService } from './ticker.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'Ticker',
        schema: TickerSchema,
      },
      {
        name: 'Symbol',
        schema: SymbolSchema,
      },
    ]),
  ],
  controllers: [TickerController],
  providers: [TickerService, HttpTickerService],
})
export class TickerModule {}
