import { Body, Controller, Get, Post, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // Endpoint to create a tenant, accessible only by SUPER_ADMIN
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN) // Only SUPER_ADMIN can access this
  @Post()
  async create(@Body() dto: CreateTenantDto) {
    // Validation logic or further checks can be added here if needed
    return await this.tenantsService.create(dto); // Calls the service to create a tenant
  }

  // Endpoint to get all tenants, accessible only by SUPER_ADMIN
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN) // Only SUPER_ADMIN can access this
  @Get()
  async findAll() {
    return await this.tenantsService.findAll(); // Calls the service to get all tenants
  }

  // Endpoint to define access for a specific tenant by ID, accessible by SUPER_ADMIN
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN) // Only SUPER_ADMIN can define access
  @Post(':id/access')
  async defineAccess(@Param('id') tenantId: string, @Body() accessData: any) {
    // Validate the accessData to ensure it has correct boolean values
    if (typeof accessData !== 'object' || accessData === null) {
      throw new BadRequestException('Access data must be an object.');
    }

    // Validate that all values in accessData are boolean
    for (const [key, value] of Object.entries(accessData)) {
      if (typeof value !== 'boolean') {
        throw new BadRequestException(`Invalid access value for role "${key}", expected boolean but got ${typeof value}`);
      }
    }

    return await this.tenantsService.defineAccess(tenantId, accessData); // Calls the service to define access for a tenant
  }
}
