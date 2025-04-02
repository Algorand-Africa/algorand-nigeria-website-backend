import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/dal/entities';
import { Token } from '../../dal/entities/token.entity';
import { BcryptService } from '../core/services/bcrypt.service';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SendgridService } from '../core';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret', // Use env variable in production
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    BcryptService,
    SendgridService,
  ],
  exports: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
