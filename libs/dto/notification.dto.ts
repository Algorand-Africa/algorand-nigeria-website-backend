import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ADMIN_NOTIFICATION, NOTIFICATION_TYPE, PERMISSION } from '../enums';
import { NotificationAction } from '../interfaces';
import { Notification } from '../typeorm';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    enum: NOTIFICATION_TYPE,
  })
  @IsEnum(NOTIFICATION_TYPE)
  @IsNotEmpty()
  type: NOTIFICATION_TYPE;

  @ApiProperty({
    type: NotificationAction,
  })
  action?: NotificationAction;
}

export class CreateAdminNotificationDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  adminId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    enum: ADMIN_NOTIFICATION,
  })
  @IsEnum(ADMIN_NOTIFICATION)
  @IsNotEmpty()
  event: ADMIN_NOTIFICATION;

  @ApiProperty()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SocketNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiProperty({
    example: {
      message: 'We are sending you money',
      type: 'sendMoney',
    },
  })
  @IsNotEmpty()
  payload: Notification;
}

export class EmitMassNotificationDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  event: ADMIN_NOTIFICATION;

  @ApiProperty()
  permission: PERMISSION;

  @ApiProperty()
  metadata?: Record<string, any>;
}
