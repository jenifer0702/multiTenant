import { Controller, Post, Get, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create user, accessible for ADMIN and SUPER_ADMIN roles
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)  // Allow both Admin and Super Admin to create users
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const { role, tenantId } = req.user;

    // For SUPER_ADMIN, tenantId can be null, but for others, it must be provided
    if (role !== Role.SUPER_ADMIN && !createUserDto.tenantId) {
      throw new BadRequestException('Tenant ID is required for non-Super Admin users');
    }

    // If SUPER_ADMIN, ensure tenantId can be null (since they have access across all tenants)
    if (role === Role.SUPER_ADMIN && !createUserDto.tenantId) {
      createUserDto.tenantId = null;  // Super admin should not require a tenantId
    }

    return this.usersService.create(createUserDto);
  }

  // List users by tenantId, accessible for ADMIN role
  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Get()
async listUsers(@Req() req: any) {
  const { role, tenantId } = req.user;

  if (role === Role.ADMIN) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is not available in the JWT payload');
    }
    return this.usersService.findAll(tenantId); // Filtered by tenant for Admin
  }

  if (role === Role.SUPER_ADMIN) {
    return this.usersService.findAll(); // No tenant filter for Super Admin
  }

  throw new BadRequestException('Unauthorized role'); // Safety fallback
}

}
