import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  name: string;
}

@Schema()
export class User extends Document {
  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  password: string;

  // TODO
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return false;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.matchPassword = function(
  enteredPassword: string,
): Promise<boolean> | boolean {
  try {
    return bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return false;
  }
};
