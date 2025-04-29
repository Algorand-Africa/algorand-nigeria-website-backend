import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(SocketGateway.name);

  emitEvent(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  afterInit() {
    this.logger.log('Socket Server initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`New socket client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`socket client disconnected: ${client.id}`);
  }
}
