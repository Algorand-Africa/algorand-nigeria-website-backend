import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from 'libs/enums';

export const Permissions = (...permissions: PERMISSION[]) =>
  SetMetadata('permissions', permissions);
