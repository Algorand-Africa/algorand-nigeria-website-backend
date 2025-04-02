import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsTimeZone,
  ValidateNested,
} from 'class-validator';

class SecurityAlertsDto {
  @IsEnum(['all', 'unknown', 'disabled'])
  @IsOptional()
  loginAttempt: 'all' | 'unknown' | 'disabled';

  @IsBoolean()
  @IsOptional()
  passwordChange: boolean;
}

class SystemNotificationsDto {
  @IsBoolean()
  @IsOptional()
  email: boolean;

  @IsBoolean()
  @IsOptional()
  sms: boolean;

  @IsBoolean()
  @IsOptional()
  mobilePush: boolean;

  @IsBoolean()
  @IsOptional()
  browser: boolean;
}

class NotificationPreferencesDto {
  @IsEnum(['all', 'importantOnly', 'none'])
  @IsOptional()
  assetUpdates: 'all' | 'importantOnly' | 'none';

  @IsEnum(['dailyDigest', 'weeklyDigest', 'none'])
  @IsOptional()
  maintenanceReminders: 'dailyDigest' | 'weeklyDigest' | 'none';
}

class SystemPreferencesDto {
  @IsEnum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'])
  @IsOptional()
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD';
}

export class UserPreferenceDto {
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SecurityAlertsDto)
  securityAlerts: SecurityAlertsDto;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SystemNotificationsDto)
  systemNotifications: SystemNotificationsDto;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notificationPreferences: NotificationPreferencesDto;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SystemPreferencesDto)
  systemPreferences: SystemPreferencesDto;
}
