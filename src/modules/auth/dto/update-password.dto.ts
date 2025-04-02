import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsEqualTo } from 'src/modules/core';
import { PASSWORD_REGEX } from 'src/modules/core/constants/password-regex';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase, one lowercase, one digit and one special character',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEqualTo('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
