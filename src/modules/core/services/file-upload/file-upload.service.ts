import { Injectable, Logger } from '@nestjs/common';
import { PinataSDK, PinResponse } from 'pinata-web3';
import { ImageData, IPFSJson, IPFSUpload } from './interface';
import { convertToUrlFormat, generateOtp } from '../../utils/string';
import * as Cloudinary from 'cloudinary';

@Injectable()
export class FileUploadService {
  private readonly pinata: PinataSDK;
  private readonly logger = new Logger(FileUploadService.name);

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_JWT_URL,
    });

    Cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadInfoToIPFS(
    data: IPFSUpload,
  ): Promise<{ ipfsUrl: string; cloudinaryUrl: string }> {
    const {
      name,
      description = 'NFT uploaded from IO Market',
      base64Image,
      externalUrl,
      traits,
      creatorName,
      creatorId,
    } = data;

    this.logger.log(`Uploading image to IPFS: ${name}`);
    const { upload, mimetype, fileName } = await this.uploadFileToIPFS(
      base64Image,
      name,
    );
    this.logger.log(`Image uploaded to IPFS: ${upload.IpfsHash}`);

    const metadata: IPFSJson = {
      name,
      description,
      image: `ipfs://${upload.IpfsHash}`,
      image_mimetype: mimetype,
      external_url: externalUrl,
      attributes: traits.map((trait) => ({
        trait_type: trait.name,
        value: trait.value,
      })),
      properties: {
        file_url: fileName,
        file_url_mimetype: mimetype,
        external_url: externalUrl,
        created_for: creatorName,
        created_at: new Date().toISOString(),
        user_id: creatorId,
      },
    };

    this.logger.log(`Uploading metadata to IPFS: ${name}`);
    const resultMeta = await this.pinata.upload.json(metadata);
    this.logger.log(`Metadata uploaded to IPFS: ${resultMeta.IpfsHash}`);

    const ipfsUrl = `ipfs://${resultMeta.IpfsHash}`;

    let cloudinaryUrl: string = '';

    try {
      const cloudinaryResponse = await this.uploadToCloudinary(
        base64Image,
        '',
        'nft-images',
      );
      cloudinaryUrl = cloudinaryResponse.image;
    } catch (error) {
      this.logger.error(`Error uploading to cloudinary: ${error}`);
    }

    return { ipfsUrl, cloudinaryUrl };
  }

  async uploadToCloudinary(
    base64: string,
    oldKey: string,
    dirName: string,
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
      const uri = `${base64}`;
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

  private async uploadFileToIPFS(
    base64Image: string,
    name?: string,
  ): Promise<{ upload: PinResponse; mimetype: string; fileName: string }> {
    const mimetype = this.getMimetype(base64Image);
    const fileExtension = mimetype.split('/')[1];
    const fileName = `${convertToUrlFormat(name || `${Date.now()}`)}.${fileExtension}`;
    const { file } = this.base64ToFile(base64Image, fileName);
    const upload = await this.pinata.upload.file(file);
    return { upload, mimetype, fileName };
  }

  private base64ToFile(base64String: string, filename: string): { file: File } {
    const arr = base64String.split(',');
    if (arr.length !== 2) {
      throw new Error('Invalid Base64 format');
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    const byteString = atob(arr[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return { file: new File([uint8Array], filename, { type: mimeType }) };
  }

  private getMimetype(base64String: string): string {
    const arr = base64String.split(',');
    if (arr.length !== 2) {
      throw new Error('Invalid Base64 format');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    return mimeType;
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
