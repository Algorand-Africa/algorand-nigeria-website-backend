import { Global, Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { SendgridService } from './services/sendgrid/sendgrid.service';
import { FileUploadService } from './services/file-upload/file-upload.service';
@Global()
@Module({
  providers: [BcryptService, SendgridService, FileUploadService],
  exports: [BcryptService, SendgridService, FileUploadService],
})
export class CoreModule {}
