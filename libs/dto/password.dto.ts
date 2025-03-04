import { IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';
import { IsEqualTo } from '../decorators/is-equal-to.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

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
  @Matches(/(?=.*?[ #?!@$%^&*-])/, {
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
