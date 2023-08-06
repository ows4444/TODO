import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { EnvironmentConfigModule } from '@/infrastructure/config/environment/environment-config.module';
import { EnvironmentConfigService } from '@/infrastructure/config/environment/environment-config.service';

@Module({
  imports: [
    Jwt.registerAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config) => ({
        secret: config.getJwtSecret(),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtModule {}
