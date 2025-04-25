import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/users.schema';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials during login
  async validateUser({ email, password }: LoginDto) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  // Log in and return the access token and refresh token
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    // JWT Payload includes user ID (sub), tenant ID (tenantId), and user role
    const payload = {
      sub: user._id,         // user ID (subject)
      role: user.role,       // user role (admin, doctor, patient)
      tenantId: user.role === 'super_admin' ? null : user.tenantId, // If super_admin, omit tenantId
    };

    // Generate access and refresh tokens
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,    // JWT secret for access token (ensure this is set in .env)
        expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Expiry for access token (default: 1 hour)
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET,  // Secret for refresh token (ensure this is set in .env)
        expiresIn: process.env.REFRESH_EXPIRES_IN || '7d', // Expiry for refresh token (default: 7 days)
      }),
    };
  }

  // Refresh the access token using the refresh token
  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token and extract payload
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      // Check if the user still exists with the given ID (optional security check)
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token with the same payload
      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          role: payload.role,
          tenantId: payload.role === 'super_admin' ? null : payload.tenantId, // For super_admin, set tenantId to null
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
