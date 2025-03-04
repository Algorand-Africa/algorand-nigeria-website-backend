import { PERMISSION } from '../enums';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(PERMISSION, { each: true })
  permissions: PERMISSION[];
}

export class UpdateRoleDto extends PartialType(RoleDto) {}
