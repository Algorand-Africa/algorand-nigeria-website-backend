import { Module } from '@nestjs/common';
import { AwsS3Service } from 'libs/helpers';
import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadService, AwsS3Service],
  exports: [FileUploadService],
})
export class FileUploadModule {}
