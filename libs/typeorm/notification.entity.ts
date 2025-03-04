import { NOTIFICATION_TYPE } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
import { NotificationAction } from '../interfaces';

@Entity('notification')
export class Notification extends Base {
  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  @Column({ nullable: false, default: true })
  new: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @Column({ nullable: false, default: false })
  read: boolean;

  @ApiProperty({
    enum: NOTIFICATION_TYPE,
  })
  @Column({ nullable: false, type: String })
  type: NOTIFICATION_TYPE;

  @ApiProperty({
    type: NotificationAction,
  })
  @Column({ nullable: true, type: 'jsonb' })
  action?: NotificationAction;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: true })
  image?: string;
}
