import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsMobilePhone,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSignUpDto } from './sign-up.dto';
import { PageOptionsWithSearchDto } from './page.dto';
import { DATE_PERIOD } from '../enums';
import { Profile } from '../typeorm/profile.entity';

export class CreateUserDto extends BaseSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  callbackUrl?: string;

  @IsMobilePhone()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  phoneNo?: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nationality: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  techSkill: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsMobilePhone()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  phoneNo?: string;
}

export class UpdateUserInAdminDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nationality: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
}

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  algoWalletAddress?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  phoneNo?: string;
}

export class UpdateUserProfileInAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  algoWalletAddress?: string;
}

export class UpdateUserSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  showPopupNotifications?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  notificationSound?: boolean;
}

export class UpdateUserSettingsInAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  showPopupNotifications?: boolean;
}

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}

export class InviteUserDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  callbackUrl?: string;
}

export class UpdateUserDetailsInAdminDto {
  @ApiProperty()
  profile?: UpdateUserProfileInAdminDto;
  @ApiProperty()
  settings?: UpdateUserSettingsInAdminDto;
  @ApiProperty()
  user?: UpdateUserInAdminDto;
}

export class GetAllUsersPageOptionsDto extends PageOptionsWithSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  filterValue?: string;

  @ApiProperty({ enum: DATE_PERIOD, default: DATE_PERIOD.ALL })
  @IsEnum(DATE_PERIOD)
  @IsOptional()
  datePeriod?: DATE_PERIOD = DATE_PERIOD.TODAY;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  toDate?: string;
}

export class GetUserCountDto {
  @ApiProperty({ enum: DATE_PERIOD, default: DATE_PERIOD.ALL })
  @IsEnum(DATE_PERIOD)
  @IsOptional()
  period?: DATE_PERIOD = DATE_PERIOD.ALL;
}

export class ReferralDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  techSkill: string;

  @ApiProperty()
  techSkillDesignation: string;

  @ApiProperty({ type: Profile })
  profile: Profile;

  @ApiProperty()
  phoneNo: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  level: number;
}

export class DownloadUsersInfoDto extends GetAllUsersPageOptionsDto {
  @ApiProperty({ enum: ['csv', 'pdf'] })
  @IsEnum(['csv', 'pdf'])
  @IsNotEmpty({ message: 'Please select a format to download the file.' })
  format: 'csv' | 'pdf';
}
