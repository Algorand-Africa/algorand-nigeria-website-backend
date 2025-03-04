import { Injectable, Logger } from '@nestjs/common';
import { SocketGateway } from './socket.provider';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly socketGateway: SocketGateway) {}
}
