import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import { IJwtService, IJwtServicePayload } from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { randomUUID } from 'crypto';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async validateUserForLocalStrategy(username: string, pass: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (user) {
      const match = await this.bcryptService.compare(pass, user.password);
      if (user && match) {
        await this.updateLoginTime(user.username);
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);
  }

  async generateAccessToken(username: string): Promise<string> {
    const uuid = randomUUID();
    const payload: IJwtServicePayload = { id: uuid, username: username };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentAccessToken(uuid, username);
    return token;
  }

  async generateRefreshToken(username: string): Promise<string> {
    const uuid = randomUUID();
    const payload: IJwtServicePayload = { id: uuid, username: username };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(uuid, username);
    return token;
  }

  async validateUserForJWTStrategy(username: string) {
    return await this.userRepository.getUserByUsername(username);
  }

  private async setCurrentRefreshToken(uuid: string, username: string) {
    await this.userRepository.updateRefreshToken(username, uuid);
  }
  private async setCurrentAccessToken(uuid: string, username: string) {
    await this.userRepository.updateAccessToken(username, uuid);
  }

  /* async getCookieWithJwtToken(username: string) {
    this.logger.log('LoginUseCases execute', `The user ${username} have been logged.`);
    const payload: IJwtServicePayload = { username: username };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
  }

  async getCookieWithJwtRefreshToken(username: string) {
    this.logger.log('LoginUseCases execute', `The user ${username} have been logged.`);
    const payload: IJwtServicePayload = { username: username };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, username);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
    return cookie;
  }

 

  async validateUserForJWTStrategy(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    return user;
  }



  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateRefreshToken(username, currentHashedRefreshToken);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(refreshToken, user.hashRefreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }*/
}
