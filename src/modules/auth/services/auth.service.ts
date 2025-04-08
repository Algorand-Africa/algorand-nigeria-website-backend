import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { User } from 'src/dal/entities';
import { BcryptService } from 'src/modules/core/services/bcrypt.service';
import { deepMerge } from 'src/modules/core/utils/object';
import { UserPreferenceDto } from 'src/modules/users/dto/user-preference.dto';
import { UserStatus } from 'src/modules/users/enums/user-status.enum';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Token, TokenType } from '../../../dal/entities/token.entity';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ProfileResponseDto } from '../dto/profile.dto';
import { ProfileUpdateDto } from '../dto/profile.dto';
import { ProfileDtoMapper } from '../mappers/profile.mapper';
import { FileUploadService, SendgridService } from 'src/modules/core';
import { SignupDto, VerifyEmailDto } from '../dto/signup.dto';
import { RoleType } from 'src/modules/users/enums/role-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Token)
    private readonly resetTokenRepository: Repository<Token>,

    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly sendgridService: SendgridService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepo.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordValid = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: ProfileDtoMapper.toDto(user),
      accessToken: token,
      expiresIn: 86400,
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const user = await this.usersRepo.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (![RoleType.ADMIN, RoleType.SUPER_ADMIN].includes(user.role)) {
      throw new UnauthorizedException('User is not an admin');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: ProfileDtoMapper.toDto(user),
      accessToken: token,
      expiresIn: 86400,
    };
  }

  async signUp(signupDto: SignupDto) {
    const {
      password,
      confirmPassword,
      email,
      fullName,
      callbackUrl,
      username,
    } = signupDto;
    const existingUser = await this.usersRepo.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('This email is already in use');
      }
      throw new BadRequestException('This username is already taken');
    }

    if (signupDto.password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const newUser = await this.usersRepo.save({
      email: email,
      password: hashedPassword,
      full_name: fullName,
      role: RoleType.USER,
      username,
    });

    // Generate a random token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await this.bcryptService.hash(verificationToken);

    // Create expiry date - 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.resetTokenRepository.save({
      code: hashedToken,
      user_id: newUser.id,
      expires_at: expiresAt,
      type: TokenType.EMAIL_VERIFICATION,
    });

    await this.sendgridService.sendEmailVerificationLink({
      email: newUser.email,
      token: verificationToken,
      name: newUser.full_name,
      callbackUrl,
    });

    return ProfileDtoMapper.toDto(newUser);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    // Find valid token
    const verifyEmailTokens = await this.resetTokenRepository.find({
      where: {
        expires_at: MoreThanOrEqual(new Date()),
        type: TokenType.EMAIL_VERIFICATION,
      },
    });

    const now = new Date();
    let validToken: Token | null = null;
    let user: User | null = null;

    // Check each token
    for (const tokenEntity of verifyEmailTokens) {
      if (tokenEntity.expires_at < now || tokenEntity.is_used) continue;

      const isValid = await this.bcryptService.compare(token, tokenEntity.code);
      if (isValid) {
        validToken = tokenEntity;
        user = await this.usersRepo.findOneBy({ id: tokenEntity.user_id });
        break;
      }
    }

    if (!validToken || !user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Update password using the new hashPassword function
    await this.usersRepo.update(user.id, { email_verified_at: new Date() });

    // Mark token as used
    validToken.is_used = true;
    await this.resetTokenRepository.save(validToken);

    return { message: 'Email verified successfully' };
  }

  async resendEmailVerificationLink(email: string, callbackUrl: string) {
    const user = await this.usersRepo.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email_verified_at) {
      throw new BadRequestException('Email already verified');
    }

    // Generate a random token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await this.bcryptService.hash(verificationToken);

    // Create expiry date - 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.resetTokenRepository.save({
      code: hashedToken,
      user_id: user.id,
      expires_at: expiresAt,
      type: TokenType.EMAIL_VERIFICATION,
    });

    await this.sendgridService.sendEmailVerificationLink({
      email: user.email,
      token: verificationToken,
      name: user.full_name,
      callbackUrl,
    });

    return { message: 'Email verification link sent' };
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.findById(userId);

    return ProfileDtoMapper.toDto(user);
  }

  async updateProfile(
    userId: string,
    profileUpdateDto: ProfileUpdateDto,
  ): Promise<ProfileResponseDto> {
    const user = await this.findById(userId);

    if (profileUpdateDto.full_name) {
      user.full_name = profileUpdateDto.full_name;
    }

    if (profileUpdateDto.phone) {
      user.phone = profileUpdateDto.phone;
    }

    const updatedUser = await this.usersRepo.save(user);

    return ProfileDtoMapper.toDto(updatedUser);
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.findById(userId);

    const base64 = `data:image/${file.mimetype.split('/')[1]};base64,${file.buffer.toString('base64')}`;

    const imageData = await this.fileUploadService.uploadToCloudinary(
      base64,
      null,
      'profile_pictures',
    );

    user.profile_picture_url = imageData.image;

    await this.usersRepo.update(userId, {
      profile_picture_url: imageData.image,
    });

    return { imageUrl: imageData.image };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepo.findOneBy({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      // Return success even if email doesn't exist for security
      return {
        message:
          'If your email exists in our system, you will receive a password reset link.',
      };
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await this.bcryptService.hash(resetToken);

    // Create expiry date - 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Save the token
    await this.resetTokenRepository.save({
      code: hashedToken,
      user_id: user.id,
      expires_at: expiresAt,
      type: TokenType.PASSWORD_RESET,
    });

    await this.sendgridService.sendPasswordResetLink({
      email: user.email,
      token: resetToken,
      name: user.full_name,
      callbackUrl: forgotPasswordDto.callbackUrl,
    });

    return {
      message: 'Password reset link has been sent to your email',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Find valid token
    const resetTokens = await this.resetTokenRepository.find({
      where: {
        expires_at: MoreThanOrEqual(new Date()),
        type: TokenType.PASSWORD_RESET,
      },
    });

    const now = new Date();
    let validToken: Token | null = null;
    let user: User | null = null;

    // Check each token
    for (const tokenEntity of resetTokens) {
      if (tokenEntity.expires_at < now || tokenEntity.is_used) continue;

      const isValid = await this.bcryptService.compare(
        resetPasswordDto.token,
        tokenEntity.code,
      );
      if (isValid) {
        validToken = tokenEntity;
        user = await this.usersRepo.findOneBy({ id: tokenEntity.user_id });
        break;
      }
    }

    if (!validToken || !user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Update password using the new hashPassword function
    const hashedPassword = await this.bcryptService.hash(
      resetPasswordDto.newPassword,
    );
    await this.usersRepo.update(user.id, { password: hashedPassword });

    // Mark token as used
    validToken.is_used = true;
    await this.resetTokenRepository.save(validToken);

    return { message: 'Password successfully reset' };
  }

  async changePassword(userId: string, payload: UpdatePasswordDto) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await this.bcryptService.compare(
      payload.currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.bcryptService.hash(payload.newPassword);

    user.password = hashedPassword;

    const updatedUser = await this.usersRepo.save(user);

    // TODO: send password changed notification

    return ProfileDtoMapper.toDto(updatedUser);
  }

  async updatePreferences(userId: string, payload: UserPreferenceDto) {
    const user = await this.findById(userId);

    user.preferences = deepMerge(user.preferences, payload);

    await this.usersRepo.save(user);

    return ProfileDtoMapper.toDto(user);
  }

  private async findById(userId: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
