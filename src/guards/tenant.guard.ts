import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class TenantGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Comes from JWT token
      const tenantIdFromToken = user.aud;
  
      // Check if tenantId is being accessed via request body, params, or query
      const tenantIdFromRequest =
        request.body?.tenantId ||
        request.params?.tenantId ||
        request.query?.tenantId;
  
      if (tenantIdFromRequest && tenantIdFromToken !== tenantIdFromRequest) {
        throw new ForbiddenException('Access to this tenant is denied.');
      }
  
      return true;
    }
  }
  