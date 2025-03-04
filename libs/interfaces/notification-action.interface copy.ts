import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '../typeorm';

export class NotificationAction {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  projectId?: string;
}

export interface AdminNotification {
  eventName: string;
  data: Partial<Notification>;
}
