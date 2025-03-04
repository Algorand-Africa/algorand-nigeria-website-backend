import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketGateway } from './socket.provider';
import { AdminGateway } from './admin.gateway';
import { AdminNotifications } from '../../libs/typeorm/admin-notification.entity';
import { AdminNotificationService } from './admin-notification.service';
import { Admin as AdminRepo } from 'libs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdminNotifications, AdminRepo])],
  providers: [
    NotificationService,
    SocketGateway,
    AdminGateway,
    AdminNotificationService,
  ],
  exports: [NotificationService, AdminNotificationService],
})
export class NotificationModule {}
