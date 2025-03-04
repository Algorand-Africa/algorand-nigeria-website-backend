import { Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
  CopyObjectCommand,
  CopyObjectCommandInput,
} from '@aws-sdk/client-s3';
import { env } from 'process';
import { ICloudStorageService } from 'libs/interfaces/cloud-storage.interface';

export class AwsS3Service implements ICloudStorageService {
  private readonly logger = new Logger(AwsS3Service.name);
  private s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
      accessKeyId: env.AWS_ACCESS_KEY || '',
    },
  });

  async getFile(details: any): Promise<any> {
    const params: GetObjectCommandInput = { ...details };
    const data = await this.s3Client.send(new GetObjectCommand(params));
    return data.Body;
  }

  async postFile(details: any): Promise<any> {
    const params: PutObjectCommandInput = { ...details };
    return await this.uploadFile(params);
  }

  async updateFile(key: string, details: any): Promise<any> {
    const params: PutObjectCommandInput = { ...details };
    params.Key = key;
    return await this.uploadFile(params);
  }

  async deleteFile(details: any): Promise<void> {
    const params: DeleteObjectCommandInput = { ...details };
    try {
      await this.s3Client.send(new DeleteObjectCommand(params));
      this.logger.log(
        `Successfully deleted ${params.Key} from ${params.Bucket} bucket`,
      );
    } catch (err) {
      this.logger.log(err);
      throw err;
    }
  }

  private async uploadFile(params: PutObjectCommandInput) {
    try {
      const results = await this.s3Client.send(new PutObjectCommand(params));
      this.logger.log(
        `Successfully created ${params.Key} and uploaded it to ${params.Bucket}/${params.Key}`,
      );
      return results;
    } catch (err) {
      this.logger.log('Error uploading file', err);
      throw err;
    }
  }

  async duplicateFile(copyParams: CopyObjectCommandInput): Promise<any> {
    try {
      await this.s3Client.send(new CopyObjectCommand(copyParams));
      this.logger.log(
        `Successfully duplicated ${copyParams.CopySource} to ${copyParams.Key}`,
      );
      return {
        sourceKey: copyParams.CopySource,
        destinationKey: copyParams.Key,
      };
    } catch (err) {
      this.logger.log('Error duplicating file', err);
      throw err;
    }
  }
}
