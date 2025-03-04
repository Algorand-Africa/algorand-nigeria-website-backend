import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  expiryDate: Date;

  @IsNotEmpty()
  userId: string;
}
