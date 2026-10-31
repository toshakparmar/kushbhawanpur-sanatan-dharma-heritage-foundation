import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');
import * as express from 'express';
import * as path from 'path';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Support BigInt serialization in JSON responses
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Helmet security headers (with crossOriginResourcePolicy for static uploads)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  // Cookies
  app.use(cookieParser());

  // Serve static uploads
  const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
  app.use('/uploads', express.static(uploadDir));

  // CORS
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-donor-token', 'x-request-id'],
  });

  // Global prefixes, pipes, filters, interceptors
  app.setGlobalPrefix('api/v1', {
    exclude: ['uploads/{*path}'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Kushbhawanpur Foundation API')
    .setDescription(
      'REST API for Kushbhawanpur Sanatan Dharma & Heritage Foundation (Dynamic Content, Donation Management, Receipts, Admin CMS)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 API running on: http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
