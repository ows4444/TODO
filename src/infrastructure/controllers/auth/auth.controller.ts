import { Body, Controller, Get, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthLoginDto, AuthRegisterDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LoginGuard } from 'src/infrastructure/common/guards/login.guard';
import { RegisterUseCases } from 'src/usecases/auth/register.usecases';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { User } from 'src/infrastructure/common/decorators/user.decorator';
import { UserModel } from 'src/domain/model/user';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

// import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard';
// import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
// import { LoginGuard } from '../../common/guards/login.guard';

// import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
// import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
// import { LoginUseCases } from '../../../usecases/auth/login.usecases';
// import { IsAuthenticatedUseCases } from '../../../usecases/auth/isAuthenticated.usecases';
// import { LogoutUseCases } from '../../../usecases/auth/logout.usecases';

// import { ApiResponseType } from '../../common/swagger/response.decorator';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: UseCaseProxy<RegisterUseCases>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@User() user: UserModel) {
    const accessToken = await this.loginUsecaseProxy.getInstance().generateAccessToken(user.username);
    const refreshToken = await this.loginUsecaseProxy.getInstance().generateRefreshToken(user.username);
    return { accessToken, refreshToken };
  }

  @Post('register')
  @ApiBody({ type: AuthRegisterDto })
  async register(@Body() body: AuthRegisterDto) {
    const service = this.registerUseCaseProxy.getInstance();

    if (await service.userShouldNotExist(body.username)) {
      const user = await service.registerUser(body.username, body.password);
      return `User ${user.username} Registered!`;
    } else this.exceptionsService.conflictException({ message: `${body.username} already Exists` });
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    return 'Logout successful';
  }

  /*
  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(auth.username);
    const refreshTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtRefreshToken(auth.username);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return 'Login successful';
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecaseProxy.getInstance().execute();
    request.res.setHeader('Set-Cookie', cookie);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy.getInstance().execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(request.user.username);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Refresh successful';
  }*/
}
