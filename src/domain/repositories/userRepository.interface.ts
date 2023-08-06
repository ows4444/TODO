import { UserModel } from '../model/user';

export interface UserRepository {
  createUser(username: string, password: string): Promise<UserModel>;

  getUserByUsername(username: string): Promise<UserModel>;

  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
  updateAccessToken(username: string, accessToken: string): Promise<void>;

  deleteRefreshAndAccessToken(username: string): Promise<void>;
}
