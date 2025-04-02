import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../users/enums/role-type.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.log('Required Roles:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    this.logger.log('User data:', {
      id: user?.id,
      role: user?.role,
    });

    if (!user || !user.role) {
      this.logger.warn('No user or role found in request');
      return false;
    }

    // Super admin check
    if (user.role === RoleType.SUPER_ADMIN) {
      this.logger.log('Super admin access granted');
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    this.logger.log(`Role check result: ${hasRole} for user role ${user.role}`);

    return hasRole;
  }
}
