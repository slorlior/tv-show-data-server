import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationModule } from './application.module';
import * as pkg from '../package.json';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);

    const swaggerOptions = new DocumentBuilder()
        .setTitle(pkg.name)
        .setDescription(pkg.description)
        .setVersion(pkg.version)
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger', app, swaggerDocument);

    await app.listen(3000);
    console.log(`Application ${pkg.name} is up on ${await app.getUrl()}`);
}
bootstrap();
