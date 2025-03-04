import { NestFactory, Reflector } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { env } from 'libs/utils';

const appName = 'admin';
const logger = new Logger(`main.${appName}.bootstrap`);
const port = env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('BlockTremp Admin')
    .setDescription(
      'API service for the Admin Dashboard of the   .',
    )
    .setVersion('1.0')
    .addTag('algorand-nigeria-admin')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(port, () => {
    logger.log(`--------- Application starts ---------`);
    logger.log(`--------------------------------------`);
    logger.log(`Listening on port: ${port} for the ${appName} app`);
  });
}
bootstrap();
