import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseUserRepository } from '../mongo/repositories/user.repository';

import { EnvironmentConfigModule } from '../config/environment/environment-config.module';
import { EnvironmentConfigService } from '../config/environment/environment-config.service';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { RepositoriesModule } from '../mongo/repositories/repositories.module';

import { UseCaseProxy } from './usecases-proxy';

import { LogoutUseCases } from '@/usecases/auth/logout.usecases';
import { LoginUseCases } from '../../usecases/auth/login.usecases';
import { RegisterUseCases } from '../../usecases/auth/register.usecases';
@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static readonly LOGIN_USECASES_PROXY = Symbol('LOGIN_USECASES_PROXY');
  static readonly REGISTER_USECASES_PROXY = Symbol('REGISTER_USECASES_PROXY');
  static readonly LOGOUT_USECASES_PROXY = Symbol('LOGOUT_USECASES_PROXY');

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [LoggerService, JwtTokenService, EnvironmentConfigService, DatabaseUserRepository, BcryptService],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) => new UseCaseProxy(new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService)),
        },
        {
          inject: [DatabaseUserRepository, BcryptService],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository, bcryptService: BcryptService) =>
            new UseCaseProxy(new RegisterUseCases(userRepo, bcryptService)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) => new UseCaseProxy(new LogoutUseCases(userRepo)),
        },
      ],
      exports: [
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
      ],
    };
  }
}
