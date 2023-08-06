import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { RootController } from './root/root.controller';
import { FlashService } from './root/flash.service';

@Module({
  imports: [ExceptionsModule, UsecasesProxyModule.register()],
  providers: [FlashService],
  controllers: [RootController, AuthController],
  exports: [FlashService],
})
export class ControllersModule {}
