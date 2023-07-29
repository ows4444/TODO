import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDbConfig } from '../../../domain/config/mongo.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService implements MongoDbConfig, JWTConfig {
  constructor(private configService: ConfigService) {}

  getMongoDbUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }
}
