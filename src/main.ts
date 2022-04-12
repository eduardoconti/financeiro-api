import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import * as helmet from 'helmet';

import { BaseException } from '@config/exceptions';
import { AppModule } from '@app/app.module';
import { HttpExceptionFilter } from '@shared/exceptions';
import { ValidationPipe } from '@shared/pipes';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle(process.env.API_NAME as string)
    .setDescription('API controle financeiro')
    .setVersion(process.env.VERSION as string)
    .addBearerAuth()
    .addTag('App', 'Gathers endpoints to check health API')
    .addTag('Authentication', 'Gathers endpoints to authenticate with API')
    .addTag('Users', 'Gathers endpoints to handle users')
    .addTag('Expenses', 'Gathers endpoints to handle expenses')
    .addTag('Earnings', 'Gathers endpoints to handle earnings')
    .addTag('Transference', 'Gathers endpoints to handle transference')
    .addTag('Categories', 'Gathers endpoints to handle categories')
    .addTag('Wallets', 'Gathers endpoints to handle wallets')
    .addTag('Graphic', 'Gathers endpoints to handle graphics')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express(),
    ],
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

  await app.listen(parseInt(process.env.SERVER_PORT as string));
}
bootstrap();
