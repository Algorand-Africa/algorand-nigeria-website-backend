import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from 'src/modules/core/decorators';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*?[A-Z])/, {
    message: 'Password must contain at least one uppercase',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'Password must contain at least one lowercase',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'Password must contain at least one digit',
  })
  @Matches(/(?=.*?[ #?!@$%^&*-])/, {
    message: 'Password must contain at least one special character',
  })
  @Matches(/.{8,}/, {
    message: 'Password must contain at least 8 digits',
  })
  password: string;

  @IsEqualTo('password')
  confirm_password: string;
}

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  token: string;
}

export class ResendTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class SignInResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  email_verified_at?: Date;

  @ApiProperty()
  user: any;
}
