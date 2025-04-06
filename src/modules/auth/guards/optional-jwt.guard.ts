import {
  CanActivate,
  ExecutionContext,
  Inject,
  Type,
  mixin,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminUsersService } from 'src/modules/users';

export const OptionalJwtGuard = (): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @Inject(AdminUsersService)
      private readonly userService: AdminUsersService,
    ) {}

    async canActivate(context: ExecutionContext) {
      try {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
          return true;
        }
        const token = request.headers.authorization.split(' ')[1];
        const config = new ConfigService();
        const jwt = new JwtService({
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: config.get('JWT_EXPIRY') },
        });
        const payload = jwt.verify(token);
        const user = await this.userService.findOne(payload.sub);

        if (user?.id == payload.sub && user?.email == payload.email) {
          request.user = { ...user };
        }
        return true;
      } catch (error) {
        return true;
      }
    }
  }

  return mixin(RoleGuardMixin);
};
