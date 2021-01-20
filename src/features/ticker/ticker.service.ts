import { Injectable } from '@nestjs/common';
import { BehaviorSubject, from, timer } from 'rxjs';
import { debounceTime, exhaustMap, filter, throttle } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { webSocket as _websocket } from 'rxjs/webSocket';
global.WebSocket = require('ws');

@Injectable()
export class TickerService {
  binanceSocket: WebSocketSubject<any>;
  cryptos = [];
  cryptosSubject: BehaviorSubject<CryptoTick[]> = new BehaviorSubject([]);

  constructor() {
    // this.binanceSocket = _websocket(
    //   'wss://stream.binance.com:9443/ws/!bookTicker',
    // ); //!bookTicker
    // this.getAll();
    // this.cryptosSubject = new BehaviorSubject(this.cryptos);
  }
  getAll() {
    this.binanceSocket.next({
      method: 'SUBSCRIBE',
      id: 1,
      params: ['btcusdt@aggTrade', 'xrpusdt@aggTrade', 'adausdt@aggTrade'],
    });
    timer(0, 3000)
      .pipe(
        debounceTime(2000),
        exhaustMap(() => this.binanceSocket),
        filter((data) => data['s']?.includes('USDT') && data['p']),
      )
      .subscribe((data) => {
        const crypto = {
          symbol: data['s'],
          price: data['p'],
          timestamp: Date.now(),
        };
        // console.log(crypto);
        this.cryptos.push(crypto);
        console.log(this.cryptos.length);
        this.cryptosSubject.next(this.cryptos);

        console.log("subj", this.cryptosSubject.value.length);
      });
    // this.binanceSocket.pipe().subscribe(
    //   (data) => {
    //     console.log(Date.now());
    //     // console.log(data);
    //     // cryptos.push(1);
    //   },
    //   (error) => {
    //     console.log('------', error);
    //   },
    // );
  }

  getData(){
    
  }
}

interface CryptoTick {
  symbol: string;
  timestamp: number;
  price: number;
}
