import { NestFactory, Reflector } from '@nestjs/core';
import { MainModule } from './main.module';
import { env } from 'libs/utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';

const appName = 'main';
const logger = new Logger(`main.${appName}.bootstrap`);
const port = env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Algorand Nigeria')
    .setDescription('API service for the Algorand Nigeria Website.')
    .setVersion('1.0')
    .addTag('algorand-nigeria')
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
