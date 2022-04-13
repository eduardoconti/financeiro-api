import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as helmet from 'helmet';

import { BaseException } from '@config/exceptions';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import 'dd-trace/init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle(process.env.API_NAME as string)
    .setDescription('API controle financeiro')
    .setVersion(process.env.VERSION as string)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    attachStacktrace: true,
    environment: process.env.ENVIRONMENT,
    beforeSend(event, hint) {
      const exception = hint?.originalException;

      if (exception instanceof BaseException) {
        event.extra = {
          message: exception.message,
          reason: exception.reason,
          error: exception.error,
          data: exception.data,
        };
      }

      return event;
    },
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  await app.listen(parseInt(process.env.PORT as string));
}
bootstrap();
