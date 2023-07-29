import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';

@Module({
  imports: [ExceptionsModule, UsecasesProxyModule.register()],
  controllers: [AuthController],
})
export class ControllersModule {}
