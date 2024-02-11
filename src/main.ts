import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './loging/http-exception.filter';
import * as Sentry from '@sentry/node';
import { SentryErrorFilter } from './loging/sentry-error.filter';
import { ProfilingIntegration } from "@sentry/profiling-node";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({
    dsn: "https://791f7d7151ef0e8405e2570fabc671ef@o4506727488421888.ingest.sentry.io/4506727602257920",
    tracesSampleRate: 1.0, 
    profilesSampleRate: 1.0,
  });
  
  // app.use(Sentry.Handlers.requestHandler());
//   app.use(Sentry.Handlers.tracingHandler());
  app.useGlobalFilters(new SentryErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  await app.listen(3000);
  
}
bootstrap();
