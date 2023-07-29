import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module';
import { MongoConfigModule } from './infrastructure/mongo/mongo.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/jwtRefresh.strategy';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigService } from './infrastructure/config/environment/environment-config.service';

@Module({
  imports: [
    PassportModule,
    LoggerModule,

    // JwtModule.registerAsync({
    //   imports: [EnvironmentConfigModule],
    //   inject: [EnvironmentConfigService],
    //   useFactory: (config) => ({
    //     secret: config.getJwtSecret(),
    //   }),
    // }),
    EnvironmentConfigModule,
    MongoConfigModule,
    ControllersModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    JwtServiceModule,
  ],
  providers: [JwtStrategy, LocalStrategy /*  JwtRefreshTokenStrategy */],
})
export class AppModule {}
