import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'libs/typeorm';
import { BcryptService } from 'libs/injectables';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';
import { FileUploadModule } from 'modules/file-upload/file-upload.module';
import { NotificationModule } from 'modules/notification/notification.module';
import { AlgorandService } from 'modules/algorand/algorand.service';
import { Profile } from 'libs/typeorm/profile.entity';

@Module({
  providers: [UserService, BcryptService, SendgridService, AlgorandService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    FileUploadModule,
    NotificationModule,
  ],
})
export class UserModule {}
