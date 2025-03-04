import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin as AdminRepo } from 'libs/typeorm';
import { Otp as OtpRepo } from 'libs/typeorm';
import { BcryptService } from 'libs/injectables';
import { UserModule } from 'modules/user/user.module';
import { RoleModule } from 'modules/role/role.module';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';
import { FileUploadModule } from 'modules/file-upload/file-upload.module';

@Module({
  providers: [AdminService, BcryptService, SendgridService],
  exports: [AdminService],
  imports: [
    TypeOrmModule.forFeature([AdminRepo, OtpRepo]),
    UserModule,
    RoleModule,
    FileUploadModule,
  ],
})
export class AdminModule {}
