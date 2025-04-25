import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: String, default: null })  // Allow tenantId to be null
  tenantId: string | null;  // Explicitly allow null
}

export const UserSchema = SchemaFactory.createForClass(User);
