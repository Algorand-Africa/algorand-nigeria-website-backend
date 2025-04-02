import { Permission } from '../enums/permission.enum';
import { RoleType } from '../enums/role-type.enum';

export const DEFAULT_ROLE_PERMISSIONS = {
  [RoleType.SUPER_ADMIN]: [Permission.ALL],
  [RoleType.USER]: [
    Permission.READ_DEVICE,
    Permission.CREATE_DEVICE_REQUEST,
    Permission.READ_DEVICE_REQUEST,
  ],
};
