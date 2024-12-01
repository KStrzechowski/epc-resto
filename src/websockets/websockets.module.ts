import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websockets';

@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
