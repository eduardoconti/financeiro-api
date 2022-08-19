import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import tracer from 'dd-trace';

import { AppModule } from '@app/app.module';

import { BaseException } from '@config/exceptions';

import { HttpExceptionFilter } from '@shared/exceptions';
import { TransformInterceptor, ValidationPipe } from '@shared/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

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
    .addTag('Sub Categories', 'Gathers endpoints to handle sub categories')
    .addTag('Wallets', 'Gathers endpoints to handle wallets')
    .addTag('Graphic', 'Gathers endpoints to handle graphics')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
  tracer.init();
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
          title: exception.title,
          detail: exception.detail,
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

  await app.listen(parseInt(process.env.PORT as string) || 3005);
}
bootstrap();
