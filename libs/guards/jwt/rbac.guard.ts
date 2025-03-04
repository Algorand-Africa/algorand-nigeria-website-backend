import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION } from 'libs/enums';
import { Admin } from 'libs/typeorm';
import { AdminService } from 'modules/admin/admin.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions?.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as Admin;

    const userPermissions = await this.adminService.getAdminPermissions(
      user.id,
    );

    if (!user || userPermissions?.length === 0) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions?.includes(permission as PERMISSION),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return hasPermission;
  }
}
