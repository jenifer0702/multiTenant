import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.schema';  // Assuming you have the user schema imported
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Login method to authenticate and return the JWT token
  async login(user: User) {
    // Ensure that user contains the necessary fields
    if (!user._id || !user.role || !user.tenantId) {
      throw new UnauthorizedException('Missing required fields in user data');
    }

    // Payload for the JWT token, ensuring tenantId, role, and userId are included
    const payload = {
      sub: user._id,            // Subject, usually the user ID (from the database)
      role: user.role,          // User's role (e.g., admin, doctor, patient)
      tenantId: user.tenantId,  // Tenant ID (ensures multi-tenant access control)
    };

    // Sign and generate the JWT token
    const accessToken = this.jwtService.sign(payload);

    // Return the access token in the response
    return { accessToken };
  }
}
