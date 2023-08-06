import { Controller, Get, Inject, Post, Request, Response, Session, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as Req, Response as Res } from 'express';
import { User } from '@/infrastructure/common/decorators/user.decorator';
import { UserModel } from '@/domain/model/user';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases-proxy';
import { SessionUser } from '@/infrastructure/common/decorators/session-user.decorator';
import { LoginGuard } from '@/infrastructure/common/guards/login.guard';
import { LoginUseCases } from '@/usecases/auth/login.usecases';

import { AuthLoginDto } from '../auth/auth-dto.class';
import { FlashService } from './flash.service';

@Controller()
@ApiTags('Home')
export class RootController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY) private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly flashService: FlashService,
  ) {}

  @Get()
  root(@Request() req: Req, @Response() response: Res, @SessionUser() user: { id: string }) {
    if (!user) return response.redirect('/login');
    return response.render('home');
  }

  @Get('login')
  index(@Response() response: Res, @Session() session: any, @SessionUser() user: { id: string }) {
    if (user) return response.redirect('/');
    const flash = this.flashService.getFlashMessage(session);
    response.render('login');
    return { flash };
  }

  @Post('logout')
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: Req, @Response() response: Res) {
    request.session.destroy((err) => {
      if (err) console.error(err);
      response.redirect('/login');
    });
  }

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@User() user: UserModel, @Request() request: Req, @Response() response: Res) {
    request.session['user'] = user.id;
    response.redirect('/');
  }
}
