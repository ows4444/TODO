import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { log } from 'console';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ResponseFormat, ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // All Exception Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // base routing
  app.setGlobalPrefix('api/v1');

  app.disable('x-powered-by', 'X-Powered-By');

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Clean Architecture Nestjs')
      .setDescription('Example with todo list')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
  }

  app.use(cookieParser());
  await app.listen(3000);
  log('listening on http://localhost:3000 ');
}
bootstrap();
