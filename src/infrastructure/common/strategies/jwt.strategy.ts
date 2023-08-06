import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerService } from '../../logger/logger.service';
import { TokenPayload } from '@/domain/model/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.headers?.authorization.split(' ')[1]]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.loginUsecaseProxy.getInstance().validateUserForJWTStrategy(payload.username);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      this.exceptionService.unauthorizedException({ message: 'User not found' });
    }

    if (user.accessToken !== payload.id) {
      this.logger.warn('JwtStrategy', `Invalid token`);
      this.exceptionService.unauthorizedException({ message: 'Invalid token' });
    }
    return user;
  }
}
