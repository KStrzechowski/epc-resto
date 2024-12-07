import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'websocket' })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(WebsocketGateway.name);

  afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
