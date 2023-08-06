import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthLoginDto, AuthRegisterDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases-proxy';
import { LoginUseCases } from '@/usecases/auth/login.usecases';
import { LoginGuard } from '@/infrastructure/common/guards/login.guard';
import { RegisterUseCases } from '@/usecases/auth/register.usecases';
import { ExceptionsService } from '@/infrastructure/exceptions/exceptions.service';
import { User } from '@/infrastructure/common/decorators/user.decorator';
import { UserModel } from '@/domain/model/user';
import { JwtAuthGuard } from '@/infrastructure/common/guards/jwtAuth.guard';
import { LogoutUseCases } from '@/usecases/auth/logout.usecases';
import JwtRefreshGuard from '@/infrastructure/common/guards/jwtRefresh.guard';

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
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY) private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY) private readonly registerUseCaseProxy: UseCaseProxy<RegisterUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY) private readonly logoutUseCaseProxy: UseCaseProxy<LogoutUseCases>,
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

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@User() user: UserModel) {
    const accessToken = await this.loginUsecaseProxy.getInstance().generateAccessToken(user.username);
    const refreshToken = await this.loginUsecaseProxy.getInstance().generateRefreshToken(user.username);

    return { accessToken, refreshToken };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@User() user: UserModel) {
    await this.logoutUseCaseProxy.getInstance().deleteRefreshAndAccessToken(user.username);
    return ` ${user.username} Logout successful`;
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
