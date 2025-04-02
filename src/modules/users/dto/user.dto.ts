import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import { RoleType } from '../enums/role-type.enum';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import { User } from 'src/dal/entities';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  role: RoleType;

  @ApiProperty()
  status: UserStatus;
}

export class UpdateUserDto {
  @ApiProperty({
    enum: UserStatus,
    required: false,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    required: false,
  })
  @IsEnum(RoleType)
  @IsOptional()
  role?: RoleType;
}

export class GetAllUsersQueryDto extends PaginationParams {
  @ApiProperty({
    required: false,
  })
  @IsEnum(RoleType)
  @IsOptional()
  role?: RoleType;

  @ApiProperty({
    enum: UserStatus,
    required: false,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export const UserDtoMapper = (user: User): UserDto => {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    imageUrl: user.profile_picture_url,
  };
};
