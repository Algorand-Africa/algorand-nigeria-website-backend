import { ApiProperty } from '@nestjs/swagger';
import { BaseSignUpDto } from './sign-up.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from '../decorators';
import { PageOptionsDto } from './page.dto';

export class CreateAdminDto extends BaseSignUpDto {
  @ApiProperty()
  @IsUUID()
  roleId: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateAdminDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string | null;
}

export class UpdateAdminProfileDto {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string | null;
}

export class UpdateAdminPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*?[A-Z])/, {
    message: 'Password must contain at least one uppercase alphabet.',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'Password must contain at least one lowercase alphabet.',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'Password must contain at least one digit.',
  })
  @Matches(/(?=.*?[ #?!@$%^.&*-])/, {
    message:
      "Password must contain at least one special character like '#?!@$%^&*-'.",
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEqualTo('password')
  confirmPassword: string;
}

export class DownloadAdminsInfoDto extends PageOptionsDto {
  @ApiProperty({ enum: ['csv', 'pdf'] })
  @IsEnum(['csv', 'pdf'])
  @IsNotEmpty({ message: 'Please select a format to download the file.' })
  format: 'csv' | 'pdf';
}
