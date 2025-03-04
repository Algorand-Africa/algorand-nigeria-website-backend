import { RequestDto } from '../dto/request.dto';

export interface AdminActivityLoggerParams<T = any> {
  description: string;
  request: RequestDto;
  callback: () => Promise<T>;
}
