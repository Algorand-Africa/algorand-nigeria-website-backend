import { UserPreferenceDto } from '../dto/user-preference.dto';

export const DEFAULT_USER_PREFERENCE: UserPreferenceDto = {
  securityAlerts: {
    loginAttempt: 'disabled',
    passwordChange: false,
  },
  systemNotifications: {
    email: true,
    sms: false,
    mobilePush: false,
    browser: false,
  },
  notificationPreferences: {
    assetUpdates: 'none',
    maintenanceReminders: 'none',
  },
  systemPreferences: {
    dateFormat: 'MM/DD/YYYY',
  },
};
