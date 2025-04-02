import { Permission } from '../enums/permission.enum';
import { RoleType } from '../enums/role-type.enum';

export const DEFAULT_ROLE_PERMISSIONS = {
  [RoleType.SUPER_ADMIN]: [Permission.ALL],
  // [RoleType.ADMIN]: [
  //   Permission.MANAGE_ORGANIZATION,
  //   Permission.MANAGE_EMPLOYEES,
  //   Permission.MANAGE_ROLES,
  //   Permission.VIEW_REPORTS,
  //   Permission.EXPORT_REPORTS,
  //   Permission.MANAGE_SETTINGS,
  // ],
  // [RoleType.MANAGER]: [
  //   Permission.READ_ORGANIZATION,
  //   Permission.READ_EMPLOYEES,
  //   Permission.MANAGE_DEVICES,
  //   Permission.APPROVE_DEVICE_REQUEST,
  //   Permission.VIEW_REPORTS,
  // ],
  [RoleType.USER]: [
    Permission.READ_DEVICE,
    Permission.CREATE_DEVICE_REQUEST,
    Permission.READ_DEVICE_REQUEST,
  ],
};
