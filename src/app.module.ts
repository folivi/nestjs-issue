import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './features/ticker/ticker.module';
import { TickerGateway } from './features/ticker.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/binance'),
    TickerModule,
  ],
  controllers: [AppController],
  providers: [AppService, TickerGateway],
})
export class AppModule {}
