import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR, MIMETYPE } from 'libs/enums';
import { fromBuffer } from 'file-type';
import { AwsS3Service } from 'libs/helpers';
import * as Cloudinary from 'cloudinary';
import {
  CopyObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { env, generateOtp } from 'libs/utils';
import { ImageData } from 'libs/interfaces';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
  ) {
    Cloudinary.v2.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  private logger = new Logger(FileUploadService.name);

  private validateMimeForImageUpload(mime: string): boolean {
    return (
      mime === MIMETYPE.JPEG ||
      mime === MIMETYPE.JPG ||
      mime === MIMETYPE.PNG ||
      mime === MIMETYPE.WEBP
    );
  }

  private getS3Bucket(): string {
    return this.configService.get('AWS_BUCKET_NAME') || '';
  }

  async duplicatePhoto(
    sourceKey: string,
    dirName = 'avatars',
  ): Promise<ImageData | undefined> {
    const bucket = this.getS3Bucket();
    const sourceKeyArr = sourceKey.split('.');
    const ext = sourceKeyArr[sourceKeyArr.length - 1];
    const params: CopyObjectCommandInput = {
      Bucket: bucket,
      CopySource: `${bucket}/${sourceKey}`,
      Key: this.generateUniqueKey(ext, '', dirName),
      ACL: 'public-read',
    };

    try {
      await this.awsS3Service.duplicateFile(params);
      return {
        imageKey: params.Key || '',
        image: `${env.AWS_ENDPOINT_URL}/${params.Key}`,
      };
    } catch (err) {
      this.logger.error(`Failed to duplicate image at ${sourceKey}`);
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async uploadPhoto(
    base64: string,
    oldKey = '',
    dirName = 'avatars',
  ): Promise<ImageData | undefined> {
    const buffer = Buffer.from(base64, 'base64');

    const file = await fromBuffer(buffer);

    if (!file) {
      throw new BadRequestException('Corrupt file');
    }

    const { mime, ext } = file;

    if (!this.validateMimeForImageUpload(mime)) {
      throw new BadRequestException('Invalid file type');
    }

    const bucket = this.getS3Bucket();
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: this.generateUniqueKey(ext, oldKey, dirName),
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: mime,
    };

    try {
      await this.awsS3Service.postFile(params);

      if (oldKey) {
        this.awsS3Service.deleteFile({
          Bucket: bucket,
          Key: oldKey,
        });

        this.deleteFromCloudinary(oldKey);
      }

      return {
        imageKey: params.Key || '',
        image: `${env.AWS_ENDPOINT_URL}/${params.Key}`,
      };
    } catch (e) {
      this.logger.error('Error uploading to S3 Bucket');
      this.logger.error(e);
      this.logger.error('Trying to upload to Cloudinary');

      try {
        return await this.uploadToCloudinary(base64, oldKey, dirName, mime);
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException('File upload failed');
      }
    }
  }

  async uploadProfilePhoto(oldKey: string, base64: string) {
    // const oldKey = user?.profile?.imageKey || '';

    return this.uploadPhoto(base64, oldKey);
  }

  generateUniqueKey(extension: string, oldKey = '', prefix = 'avatars') {
    const time = Date.now().toString();
    let key: string;

    while (true) {
      key = `${prefix}/${time}-${generateOtp(10)}.${extension}`;

      if (key !== oldKey) {
        break;
      }
    }

    return key;
  }

  async deleteFile(key: string) {
    try {
      const bucket = this.getS3Bucket();

      return this.awsS3Service.deleteFile({
        Bucket: bucket,
        Key: key,
      });
    } catch (error) {
      this.logger.error(error);
      this.logger.error(
        'There was a problem deleting the file with key ' + key,
      );
      this.deleteFromCloudinary(key);
    }
  }

  async uploadToCloudinary(
    base64: string,
    oldKey: string,
    dirName: string,
    mime: string,
  ): Promise<ImageData | undefined> {
    let publicId: string;

    if (!oldKey) {
      const time = Date.now().toString();
      publicId = `${time}-${generateOtp(10)}`;
    } else {
      publicId = oldKey;
    }

    this.logger.log('Uploading to cloudinary...');

    return new Promise<ImageData>((resolve, reject) => {
      const uri = `data:${mime};base64,${base64}`;
      Cloudinary.v2.uploader.upload(
        uri,
        { folder: dirName, public_id: publicId },
        (error, result) => {
          if (error || !result) {
            reject(error || 'There was a problem uploading the image');
          } else {
            const data: ImageData = {
              imageKey: publicId,
              image: result.url,
            };
            this.logger.log(`Upload successful. Public ID: ${publicId}`);
            resolve(data);
          }
        },
      );
    });
  }

  async deleteFromCloudinary(key: string) {
    return new Promise<any>((resolve) => {
      Cloudinary.v2.uploader.destroy(key, (error, result) => {
        if (error) {
          resolve(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
