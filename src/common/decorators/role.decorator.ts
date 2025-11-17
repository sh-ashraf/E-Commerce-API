import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';
export const ROLE_KEY = 'access_roles';
export const Role = (access_roles: UserRole[]) => {
  return SetMetadata(ROLE_KEY, access_roles);
};
