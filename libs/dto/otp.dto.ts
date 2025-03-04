import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOTPDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}

export class ResendVasOTPDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}

export class ResetOTPDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsDate()
  expirationTime: Date;
}
