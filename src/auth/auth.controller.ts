import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';
import { RolesGuard } from '../guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }
}
