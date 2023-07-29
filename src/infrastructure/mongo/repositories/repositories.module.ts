import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [DatabaseUserRepository],
  exports: [DatabaseUserRepository],
})
export class RepositoriesModule {}
