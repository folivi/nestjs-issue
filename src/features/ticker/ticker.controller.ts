import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { HttpTickerService } from './http-ticker.service';

@Controller('ticker')
export class TickerController {
  constructor(private readonly _tickerService: HttpTickerService) {}
  @Get('all')
  async getCached(@Res() response: Response) {
    const promises = await this._tickerService.getCached();
    Promise.all(promises)
      .then((data) => {
        // console.log(data.filter(d => d.symbol == 'BTCUSDT'));
        return response.json({ data });
      })
      .catch((error) => console.log(error));
  }

  @Get()
  getAll(@Res() response: Response) {
    console.log(Date.now());

    this._tickerService.getSymbols().subscribe((data) => {
      const grouped = this.groupByKey(data, 'symbol');
      //   const hourlyData = [];
      //   const timeInterval = 360; // 2 snaps per minute
      const values = Object.keys(grouped).map((symbol) => {
        const tickers = grouped[symbol];
        return { symbol, ticks: this.every_nth(tickers, 120) };
      });

      //   console.log('values', JSON.stringify(values));

      //   const values = Object.keys(grouped).map((symbol) => {
      //     const tickers = grouped[symbol];
      //     const first = tickers[0];
      //     const last = tickers[tickers.length - 1];
      //     // const last15 = tickers[tickers.length - 1];
      //     // console.log("first, last", first, last);

      //     return { symbol, first: first, last: last };
      //   });
      console.log(values);

      return response.json({ data: values });
    });
  }
  every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

  private groupByKey(array: any[], key: string) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }
}
