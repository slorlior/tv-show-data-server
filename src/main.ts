import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationModule } from './application.module';
import * as pkg from '../package.json';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { ENV_MISSING_PORT } from './env.errors';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    const configService = app.get(ConfigService);

    const swaggerOptions = new DocumentBuilder()
        .setTitle(pkg.name)
        .setDescription(pkg.description)
        .setVersion(pkg.version)
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger', app, swaggerDocument);

    const port = configService.get<number>('PORT');
    if (!port) {
        throw new InternalServerErrorException(ENV_MISSING_PORT);
    }
    await app.listen(port);
    console.log(`Application ${pkg.name} is up on ${await app.getUrl()}`);
}
bootstrap();
