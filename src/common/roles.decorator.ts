// src/common/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum'; // Assuming you have an enum for roles

export const ROLES_KEY = 'roles'; // Define the key name
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); // Use SetMetadata to attach roles
