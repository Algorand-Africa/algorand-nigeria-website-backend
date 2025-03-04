import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'libs/typeorm';
import { FileUploadService } from 'modules/file-upload/file-upload.service';
import { AwsS3Service } from 'libs/helpers';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';
import {
  AdminController,
  AuthController,
  RoleController,
  AdminActivityController,
} from './controllers';
import { env } from 'libs/utils';
import {
  RoleModule,
  UserModule as NormalUserModule,
  AdminAuthModule,
  FileUploadModule,
  NotificationModule,
  AdminModule as AdminSubModule,
  AdminActivityModule,
} from 'modules';

@Module({
  imports: [
    NormalUserModule,
    AdminSubModule,
    AdminAuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        host: env.DB_HOST as any,
        port: env.DB_PORT as any,
        username: env.DB_USERNAME as any,
        password: env.DB_PASSWORD as any,
        database: env.DB_NAME as any,
        entities,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    FileUploadModule,
    NotificationModule,
    RoleModule,
    AdminActivityModule,
  ],
  controllers: [
    AdminController,
    AuthController,
    RoleController,
    AdminActivityController,
  ],
  providers: [FileUploadService, AwsS3Service, SendgridService],
})
export class AdminModule {}
