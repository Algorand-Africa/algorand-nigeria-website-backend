import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBase64()
  base64: string;
}
