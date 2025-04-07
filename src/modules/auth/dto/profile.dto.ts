import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsTimeZone } from 'class-validator';

export class ProfileUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;
}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  verified: boolean;

  @ApiPropertyOptional()
  role: string;

  @ApiPropertyOptional()
  image?: string;
}
