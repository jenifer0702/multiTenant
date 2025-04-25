import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from './users.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.role !== 'super_admin' && !createUserDto.tenantId) {
        throw new BadRequestException('Tenant ID is required for non-Super Admin users');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        tenantId: createUserDto.role === 'super_admin' ? null : createUserDto.tenantId,
      });

      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Error while creating the user: ' + error.message);
    }
  }

  // Find users by tenant ID
  async findByTenant(tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required to find users');
    }

    const users = await this.userModel.find({ tenantId }).exec();
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for tenant with ID ${tenantId}`);
    }
    return users;
  }

  // Find a single user by ID
  async findById(id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required to find the user');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // ✅ Final version: find all users, optionally filtered by tenantId
  async findAll(tenantId?: string) {
    if (tenantId) {
      return this.userModel.find({ tenantId }).exec();
    }
    return this.userModel.find().exec(); // For SUPER_ADMIN
  }
}
