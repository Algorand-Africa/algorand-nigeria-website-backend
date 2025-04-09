import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseResponseDto } from '../../core/dto/base-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { ProfileUpdateDto } from '../dto/profile.dto';
import { ProfileResponseDto } from '../dto/profile.dto';
import {
  SignupDto,
  VerifyEmailDto,
  ResendEmailVerificationLinkDto,
} from '../dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUpDto: SignupDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @Post('resend-email-verification-link')
  @HttpCode(HttpStatus.OK)
  resendEmailVerificationLink(
    @Body() resendEmailVerificationLinkDto: ResendEmailVerificationLinkDto,
  ) {
    return this.authService.resendEmailVerificationLink(
      resendEmailVerificationLinkDto.email,
      resendEmailVerificationLinkDto.callbackUrl,
    );
  }
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { properties: { message: { type: 'string' } } } })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return new BaseResponseDto({
      status: 200,
      description: 'Profile updated successfully',
      data: await this.authService.resetPassword(resetPasswordDto),
    });
  }

  @Get('profile')
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get user profile information' })
  async getProfile(
    @CurrentUser() user: { id: string },
  ): Promise<BaseResponseDto<ProfileResponseDto>> {
    return new BaseResponseDto({
      status: 200,
      description: 'Profile updated successfully',
      data: await this.authService.getProfile(user.id),
    });
  }

  @Patch('profile')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update user profile settings' })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() profileUpdateDto: ProfileUpdateDto,
  ): Promise<BaseResponseDto<ProfileResponseDto>> {
    return new BaseResponseDto({
      status: 200,
      description: 'Profile updated successfully',
      data: await this.authService.updateProfile(user.id, profileUpdateDto),
    });
  }

  @Post('profile/avatar')
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Profile picture uploaded successfully',
    type: String,
  })
  async uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    return new BaseResponseDto({
      status: 200,
      description: 'Profile picture uploaded successfully',
      data: await this.authService.updateProfilePicture(user.id, file),
    });
  }

  @Patch('password')
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: { id: string },
  ) {
    return new BaseResponseDto({
      description: 'Password updated successfully',
      data: await this.authService.changePassword(user.id, updatePasswordDto),
    });
  }
}
