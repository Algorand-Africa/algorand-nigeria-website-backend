import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'libs/typeorm';
import { env } from 'libs/utils';
import {
  AuthModule,
  FileUploadModule,
  NotificationModule,
  UserModule,
} from 'modules';
import { AuthController, UserController } from './controllers';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
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
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    AuthModule,
    HttpModule,
    FileUploadModule,
    NotificationModule,
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class MainModule {}
