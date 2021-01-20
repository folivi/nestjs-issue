import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { from, of, timer } from 'rxjs';
import { share, switchAll, switchMap } from 'rxjs/operators';
import { Ticker, Symbol } from './ticker.interface';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class HttpTickerService {
  tickers$;
  client;
  constructor(
    private readonly _httpClient: HttpService,
    @InjectModel('Ticker')
    private readonly _ticker: Model<Ticker>,
    @InjectModel('Symbol')
    private readonly _symbol: Model<Symbol>,
    private readonly redisService: RedisService,
  ) {
    // this.initSymbols();
    this.getAll();
    this.client = this.redisService.getClient();
    this.tickers$.subscribe((response) => {
      response.data
        .filter((symbol) => symbol.symbol.includes('USDT'))
        .forEach((_data) => {
          // console.log(_data);
          const tick = {
            symbol: _data['symbol'],
            price: _data['price'],
            timestamp: Date.now(),
          };
          // console.log(tick);
          // this.client.del(tick.symbol);

          this.client.rpush(tick.symbol, JSON.stringify(tick));
          this._ticker.create(tick);
        });
    });

    // client.set('START_TIME', 'cacaca').then(data => {
    //   console.log('data', data);
    // }).catch(err => {
    //   console.log("error", err);

    // });

    // this.client
    //   .lrange('ETHUSDT', 0, -1)
    //   .then((data) => {
    //     console.log('data', JSON.stringify(data));
    //   })
    //   .catch((err) => {
    //     console.log('error', err);
    //   });
  }
  initSymbols() {
    this._httpClient
      .get('https://api.binance.com/api/v3/exchangeInfo')
      .subscribe((response) => {
        const symbols = response.data.symbols
          .filter(
            (symbol) =>
              symbol.status !== 'BREAK' && symbol.symbol.includes('USDT'),
          )
          .map((symbol) => ({ symbol: symbol.symbol }));
        symbols.forEach((symbol) => {
          this._symbol.create(symbol);
        });
      });
  }

  getAll() {
    this.tickers$ = timer(1, 30000).pipe(
      switchMap(() =>
        this._httpClient.get('https://api.binance.com/api/v3/ticker/price'),
      ),
      share(),
    );

    // this._httpClient
    //   .get('https://api.binance.com/api/v3/ticker/price')
    //   .subscribe((response) => {
    //     console.log(response.data);
    //   });
  }

  getSymbols() {
    return from(this._symbol.find()).pipe(
      switchMap((symbols) => {
        const cryptos = symbols.map((crypto: any) => crypto.symbol);
        return from(this._ticker.find({ symbol: { $in: cryptos } }));
      }),
    );
  }

  async getCached() {
    const symbols = await this._symbol.find();
    const cryptos = symbols.map((crypto: any) => crypto.symbol);
    console.log(symbols);
    // let cryptoTickers = [];
    const cryptoTickers = await cryptos.map(async (symbol) => {
      const values = await this.client.lrange(symbol, 0, -1);
      const line = { symbol, values: this.every_nth(values, 2) };
      // cryptoTickers = [...cryptoTickers, line];
      return line;
    });
    // console.log("cryptoTickers", cryptoTickers);
    return cryptoTickers;

    // const values = cryptos.map(crypto => this.client.lrange(crypto, 0, -1));
    // return values;
    // Promise.all(values).then(values => {
    //   console.log(typeof values);
    //   console.log(values);
    // })

    // return from(this._symbol.find()).pipe(
    //   switchMap((symbols) => {

    //     const obs = cryptos.map((symbol) =>
    //       from(this.client.lrange(symbol, 0, -1)),
    //     );
    //     return obs;
    //   }),
    //   switchMap((values) => {
    //     // console.log('values', values);
    //     values.subscribe((value) => console.log(JSON.parse(value)));

    //     return of([]);
    //   }),
    // );
  }

  every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
}

export interface TestInterface {
  title: string | { name: string };
}

// let caca: TestInterface;
// caca.title = 'caca';
