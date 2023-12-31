import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { log } from 'console';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ResponseFormat, ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import connectMongo from 'connect-mongo';

async function bootstrap(): Promise<void> {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // All Exception Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(resolve('./src/views/partials'));

  app.useGlobalInterceptors(new ResponseInterceptor());
  // base routing
  app.setGlobalPrefix('api/v1', { exclude: ['/', '/login', '/logout'] });

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

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 60000000 },
      store: connectMongo.create({
        mongoUrl: 'mongodb://localhost:27017/nestjs-session',
        ttl: 60000000,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(3000);
  log('listening on http://localhost:3000');
}
bootstrap();
