import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSignUpDto } from './sign-up.dto';
export class ProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  algoWalletAddress?: string;
}
export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profile: ProfileDto;
}

export class CreateUserDto extends BaseSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}
