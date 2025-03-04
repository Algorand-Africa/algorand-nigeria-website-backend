import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'libs/guards/local/local.strategy';
import { JwtStrategy } from 'libs/guards/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from 'libs/injectables';
import { jwtConstants } from 'libs/constants/jwt-constants';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, BcryptService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
