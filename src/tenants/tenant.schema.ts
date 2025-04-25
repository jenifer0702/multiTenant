import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tenant extends Document {
  @Prop({ required: true })
  name: string;

  // Define 'access' as a map of string keys (roles) and boolean values (access rights)
  @Prop({ type: Map, of: Boolean, required: true })
  access: Map<string, boolean>;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
