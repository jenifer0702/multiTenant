import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../common/roles.decorator';  // Assuming you have this key in your roles decorator
import { Role } from '../common/role.enum';  // Assuming you have a Role enum

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the required roles for the current handler
    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    
    // If no roles are required, grant access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;  // The user object added by the Auth Guard

    // If no user or no role, throw UnauthorizedException
    if (!user || !user.role) {
      throw new UnauthorizedException('User role is not available');
    }

    // Check if the user's role matches any of the required roles
    return requiredRoles.includes(user.role);  // Grant access if user's role matches one of the required roles
  }
}
