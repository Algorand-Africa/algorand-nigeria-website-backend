export const CloudStorageService = 'Cloud Storage Service';

export interface ICloudStorageService {
  postFile(details: any): Promise<any>;
  getFile(details: any): Promise<any>;
  updateFile(key: string, update: any): Promise<any>;
  deleteFile(details: any): Promise<void>;
}
