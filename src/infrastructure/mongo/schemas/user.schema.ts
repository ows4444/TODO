import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserModel } from './../../../domain/model/user';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User implements Omit<UserModel, 'id' | 'refreshToken' | 'accessToken'> {
  _id: Types.ObjectId;
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;

  @Prop()
  access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 }, { unique: true, name: 'username_idx' });
