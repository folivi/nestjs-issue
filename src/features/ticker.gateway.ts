import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { json } from 'express';
import { from, interval, Observable, of, timer } from 'rxjs';
import { map, repeat, tap } from 'rxjs/operators';
import { Client, Server } from 'socket.io';
import { TickerService } from './ticker/ticker.service';

@WebSocketGateway(4000)
//@WebSocketGateway(4000, { namespace: '' })
export class TickerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly _ticketService: TickerService) {}
  private readonly logger = new Logger('WS');
  private count = 0;
  @WebSocketServer() private ws: Server;

  afterInit(server: any) {
    this.logger.log('websocket init');
  }
  handleConnection(client: any, ...args: any[]) {
    // console.log(client);
  }

  handleDisconnect(client: any) {
    this.count -= 1;
    this.logger.log(`disconnect ${this.count}`);
  }

  @SubscribeMessage('ticker')
  onEvent(@MessageBody() data: any): Observable<WsResponse<any>> {
    const event = 'ticker';
    // return timer(1000).pipe(
    //   tap(() => ({
    //     event, data: "8";
    //   })),
    // );
    return from(this._ticketService.cryptosSubject).pipe(
      map((data) => ({ event, data })),
    );
    //return of({ event, data: this._ticketService.cryptos.length });
    // return of({ event, data: 444 });
  }
}
