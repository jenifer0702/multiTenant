import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';  // Import ProfileService

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}  // Inject ProfileService

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    this.logger.log(`Fetching profile for user with id: ${id}`);

    try {
      const profile = await this.profileService.findOne(id);  // Fetch profile using ProfileService

      if (!profile) {
        return { message: 'Profile not found' };  // Handle case when profile is not found
      }

      return { profile };  // Return the fetched profile
    } catch (error) {
      this.logger.error('Error fetching profile:', error);
      throw error;  // Throw error to be handled globally
    }
  }
}
