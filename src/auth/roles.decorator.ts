import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/core/models';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
