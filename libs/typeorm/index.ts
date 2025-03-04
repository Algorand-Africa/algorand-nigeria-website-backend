import { User } from './user.entity';
import { Admin } from './admin.entity';
import { Role } from './role.entity';
import { VerificationToken } from './verification-token.entity';
import { AdminNotifications } from './admin-notification.entity';
import { Profile } from './profile.entity';
import { Otp } from './otp.entity';
import { AdminActivity } from './admin-activity.entity';
import { Notification } from './notification.entity';

const entities = [
  User,
  Admin,
  Notification,
  Role,
  VerificationToken,
  AdminNotifications,
  Profile,
  Otp,
  AdminActivity,
  Notification,
];

export {
  User,
  Admin,
  Role,
  AdminNotifications,
  Profile,
  Otp,
  AdminActivity,
  Notification,
};

export default entities;
