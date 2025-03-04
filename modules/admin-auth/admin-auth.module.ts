import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalAdminStrategy } from 'libs/guards/local/local-admin.strategy';
import { JwtAdminStrategy } from 'libs/guards/jwt/jwt-admin.strategy';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from 'libs/injectables';
import { jwtConstants } from 'libs/constants/jwt-constants';
import { AdminModule } from 'modules/admin/admin.module';

@Module({
  providers: [
    AdminAuthService,
    LocalAdminStrategy,
    JwtAdminStrategy,
    BcryptService,
  ],
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.adminSecret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
