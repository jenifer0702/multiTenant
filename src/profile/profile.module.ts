// profile.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';  // Import ProfileService
import { User, UserSchema } from '../users/users.schema';  // Assuming User schema

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],  // Import the User schema
  controllers: [ProfileController],
  providers: [ProfileService],  // Provide the ProfileService
})
export class ProfileModule {}
