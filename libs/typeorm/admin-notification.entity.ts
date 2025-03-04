import { ADMIN_NOTIFICATION } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('admin_notifications')
export class AdminNotifications extends Base {
  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  adminId: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: 'varchar', nullable: true })
  title: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: 'varchar', nullable: true })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  read: boolean;

  @ApiProperty({
    enum: ADMIN_NOTIFICATION,
  })
  @Column({ type: 'varchar', nullable: true })
  event: ADMIN_NOTIFICATION;

  @ApiProperty({
    type: Object,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
