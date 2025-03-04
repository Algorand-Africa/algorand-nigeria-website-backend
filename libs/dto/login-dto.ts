import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VasLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LogInResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  isOnboarded: boolean;
}

export class BusinessVerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Invalid OTP length',
  })
  @MaxLength(6, {
    message: 'Invalid OTP length',
  })
  otp: string;
}

export class BusinessVerificationResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  message: string;
}

export class BusinessForgotPasswordBeginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  callbackUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
