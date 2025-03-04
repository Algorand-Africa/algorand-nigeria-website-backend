import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AdminNotification } from '../../libs/interfaces';

@WebSocketGateway()
export class AdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(AdminGateway.name);

  emitNotificationEvent({ eventName, data }: AdminNotification) {
    this.server.emit(eventName, data);
  }

  afterInit() {
    this.logger.log('Admin Notification Socket Server initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(
      `New admin notification socket client connected: ${client.id}`,
    );
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(
      `Admin notification socket client disconnected: ${client.id}`,
    );
  }
}
