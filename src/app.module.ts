import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './features/ticker/ticker.module';
import { TickerGateway } from './features/ticker.gateway';
import { TickerService } from './features/ticker/ticker.service';
import { HttpTickerService } from './features/ticker/http-ticker.service';
import { SymbolSchema, TickerSchema } from './features/ticker/ticker-schema';
import { TickerController } from './features/ticker/ticker.controller';
import { RedisModule } from 'nestjs-redis';

const options = {
  url: 'redis://127.0.0.1:6379/4',
};

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/binance'),
    RedisModule.register(options),
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
    TickerModule,
    HttpModule,
  ],
  controllers: [AppController, TickerController],
  providers: [AppService, TickerService, HttpTickerService],
  // providers: [AppService, TickerGateway, TickerService, HttpTickerService],
})
export class AppModule {}
