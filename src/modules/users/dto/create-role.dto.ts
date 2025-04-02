import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateRoleDto {
  @ApiProperty({ example: 'IT Manager' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Manages IT infrastructure and devices' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: [Permission.DEVICE_MANAGEMENT, Permission.MANAGE_DEVICES],
    isArray: true,
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
