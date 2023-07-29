import { UserModel } from '../model/user';

export interface UserRepository {
  getUserByUsername(username: string): Promise<UserModel>;
  updateLastLogin(username: string): Promise<void>;
  createUser(username: string, password: string): Promise<UserModel>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
  updateAccessToken(username: string, accessToken: string): Promise<void>;
}
