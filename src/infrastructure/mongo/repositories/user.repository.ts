import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserModel } from '../../../domain/model/user';
import { UserRepository } from '../../../domain/repositories/userRepository.interface';
import { User } from '../schemas/user.schema';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name)
    private userSchemaRepository: Model<User>,
  ) {}
  async deleteRefreshAndAccessToken(username: string): Promise<void> {
    await this.userSchemaRepository.updateOne({ username: username }, { $unset: { refresh_token: 1, access_token: 1 } });
  }
  async updateAccessToken(username: string, accessToken: string): Promise<void> {
    await this.userSchemaRepository.updateOne({ username: username }, { access_token: accessToken });
  }

  async updateRefreshToken(username: string, refreshToken: string): Promise<void> {
    await this.userSchemaRepository.updateOne({ username: username }, { refresh_token: refreshToken });
  }

  async createUser(username: string, password: string): Promise<UserModel> {
    const userEntity = this.toUserEntity({
      id: null,

      username: username,
      password: password,

      refreshToken: null,
      accessToken: null,
    });
    return this.toUser(await this.userSchemaRepository.create(userEntity));
  }

  async updateLastLogin(username: string): Promise<void> {
    await this.userSchemaRepository.updateOne({ username: username }, { updatedDate: new Date() });
  }

  async getUserByUsername(username: string): Promise<UserModel> {
    const userEntity = await this.userSchemaRepository.findOne({ username: username });
    return userEntity ? this.toUser(userEntity) : null;
  }

  private toUser(userEntity: User): UserModel {
    const adminUser: UserModel = new UserModel();

    adminUser.id = userEntity._id.toString();
    adminUser.username = userEntity.username;
    adminUser.password = userEntity.password;

    adminUser.refreshToken = userEntity.refresh_token;
    adminUser.accessToken = userEntity.access_token;

    return adminUser;
  }

  private toUserEntity(adminUser: UserModel): User {
    const userEntity: User = new User();

    userEntity.username = adminUser.username;
    userEntity.password = adminUser.password;

    userEntity.refresh_token = adminUser.refreshToken;
    userEntity.access_token = adminUser.accessToken;

    return userEntity;
  }
}
