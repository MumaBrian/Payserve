import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
	SwaggerModule,
	DocumentBuilder,
	SwaggerDocumentOptions,
} from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Finserve')
		.setDescription('A fintech application for developers')
		.setVersion('1.0')
		.addBearerAuth(
			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			'authenticationToken',
		)
		.build();

	const swaggerOptions: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) =>
			methodKey,
	};
	const document = SwaggerModule.createDocument(app, config, swaggerOptions);
	SwaggerModule.setup('api', app, document);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('port') || 3000;
	await app.listen(port);
}
bootstrap();
