import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module';
import { MongoConfigModule } from './infrastructure/mongo/mongo.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/jwtRefresh.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    LoggerModule,
    EnvironmentConfigModule,
    MongoConfigModule,
    ControllersModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
  ],
  providers: [JwtStrategy, LocalStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
