import { IsString, IsEmail, IsOptional, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsMongoId()
  tenantId?: string | null;  // Allow tenantId to be a string or null
}
