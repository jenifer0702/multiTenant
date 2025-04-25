import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tenant } from './tenant.schema';
import { CreateTenantDto } from '../dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<Tenant>) {}

  async create(dto: CreateTenantDto) {
    const tenant = new this.tenantModel(dto);
    return tenant.save();
  }

  async findAll() {
    return this.tenantModel.find();
  }

  // Define the access for a specific tenant
  async defineAccess(tenantId: string, accessData: any) {
    // Find the tenant by its ID
    const tenant = await this.tenantModel.findById(tenantId);
    
    if (!tenant) {
      throw new Error(`Tenant with ID ${tenantId} not found`);
    }

    // Ensure that the accessData is an object
    if (typeof accessData !== 'object' || accessData === null) {
      throw new Error('Invalid access data format');
    }

    // Validate and convert accessData values to boolean
    const accessMap = new Map<string, boolean>(
      Object.entries(accessData).map(([key, value]) => {
        // Ensure value is boolean, convert if necessary
        if (typeof value !== 'boolean') {
          throw new Error(`Invalid value for role "${key}", expected boolean but got ${typeof value}`);
        }
        return [key, value];
      })
    );

    // Update the tenant's access field with the map
    tenant.access = accessMap;

    // Save the updated tenant
    await tenant.save();

    return {
      message: 'Access defined successfully',
      tenantId,
      accessData: Object.fromEntries(accessMap), // Convert Map back to object for response
    };
  }
}
