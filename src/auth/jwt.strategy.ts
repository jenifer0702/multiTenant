import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';  // Import UnauthorizedException

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: process.env.JWT_SECRET,  // Secret key for JWT signing (ensure it's set in .env)
    });
  }

  async validate(payload: any) {
    // Log the payload for debugging purposes (optional)
    console.log('JWT Payload:', payload);

    // Check if the necessary fields are present in the payload
    if (!payload.sub || !payload.role) {
      // If user ID or role is missing, throw an UnauthorizedException
      throw new UnauthorizedException('JWT payload is missing required fields: sub or role');
    }

    // If the role is not 'super_admin', make sure tenantId is present
    if (payload.role !== 'super_admin' && !payload.tenantId) {
      throw new UnauthorizedException('JWT payload is missing required field: tenantId');
    }

    // Return the validated user data, which will be attached to the request object
    return {
      userId: payload.sub,         // User ID from the JWT payload (typically `sub`)
      role: payload.role,          // User's role (from the payload)
      tenantId: payload.tenantId,  // Tenant ID (from the payload)
    };
  }
}
