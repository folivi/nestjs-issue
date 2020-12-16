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
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, Server } from 'socket.io';

@WebSocketGateway(4000)
//@WebSocketGateway(4000, { namespace: '' })
export class TickerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('WS');
  private count = 0;
  @WebSocketServer() private ws: Server;

  afterInit(server: any) {
    this.logger.log('websocket init');
  }
  handleConnection(client: any, ...args: any[]) {
    this.count += 1;
    this.logger.log(this.count);
    console.log(client);

    this.ws.on('ticker', (data) => {
      console.log('my:event triggered by adding listener to socket'); 
    });

    setInterval(() => {
      this.count += 2;
    }, 1000);
  }
  
  handleDisconnect(client: any) {
    this.count -= 1;
    this.logger.log(`disconnect ${this.count}`);
  }

  @SubscribeMessage('ticker')
  onEvent(@MessageBody() data: any): Observable<WsResponse<number>> {
    const event = 'ticker';
    const response = [1, 2, 3];
    return from(response).pipe(map((data) => ({ event, data })));
  }
}
