import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseUserRepository } from '../mongo/repositories/user.repository';

import { EnvironmentConfigModule } from '../config/environment/environment-config.module';
import { EnvironmentConfigService } from '../config/environment/environment-config.service';

import { LoginUseCases } from '../../usecases/auth/login.usecases';
import { RegisterUseCases } from '../../usecases/auth/register.usecases';
// import { addTodoUseCases } from '../../usecases/todo/addTodo.usecases';
// import { deleteTodoUseCases } from '../../usecases/todo/deleteTodo.usecases';
// import { GetTodoUseCases } from '../../usecases/todo/getTodo.usecases';
// import { getTodosUseCases } from '../../usecases/todo/getTodos.usecases';
// import { updateTodoUseCases } from '../../usecases/todo/updateTodo.usecases';
// import { IsAuthenticatedUseCases } from '../../usecases/auth/isAuthenticated.usecases';
// import { LogoutUseCases } from '../../usecases/auth/logout.usecases';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { RepositoriesModule } from '../mongo/repositories/repositories.module';

import { UseCaseProxy } from './usecases-proxy';
import { ExceptionsService } from '../exceptions/exceptions.service';

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  // Auth
  static readonly LOGIN_USECASES_PROXY = Symbol('LOGIN_USECASES_PROXY');
  static readonly REGISTER_USECASES_PROXY = Symbol('REGISTER_USECASES_PROXY');
  // static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  // static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  // static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
  // static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
  // static POST_TODO_USECASES_PROXY = 'postTodoUsecasesProxy';
  // static DELETE_TODO_USECASES_PROXY = 'deleteTodoUsecasesProxy';
  // static PUT_TODO_USECASES_PROXY = 'putTodoUsecasesProxy';

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
        /*   {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) => new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) => new UseCaseProxy(new GetTodoUseCases(todoRepository)),
        },
        {
          inject: [DatabaseTodoRepository],
          provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
          useFactory: (todoRepository: DatabaseTodoRepository) => new UseCaseProxy(new getTodosUseCases(todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.POST_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new addTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new updateTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, DatabaseTodoRepository],
          provide: UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: DatabaseTodoRepository) =>
            new UseCaseProxy(new deleteTodoUseCases(logger, todoRepository)),
        },*/
      ],
      exports: [
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        /*UsecasesProxyModule.GET_TODO_USECASES_PROXY,
        UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
        UsecasesProxyModule.POST_TODO_USECASES_PROXY,
        UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
        UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,*/
      ],
    };
  }
}
