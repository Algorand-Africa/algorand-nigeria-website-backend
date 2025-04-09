import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dal/entities';
import { Repository } from 'typeorm';

/**
 * This guard is used to make the request optional.
 * It will return true if the request is not authenticated.
 * It will return the user if the request is authenticated.
 * The module using it must have the UserRepository injected.
 */
export const OptionalJwtGuard = (): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
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
        const user = await this.userRepository.findOne({
          where: { id: payload.sub },
        });

        if (user?.id == payload.sub && user?.email == payload.email) {
          request.user = { ...user };
        }
        return true;
      } catch {
        return true;
      }
    }
  }

  return mixin(RoleGuardMixin);
};
