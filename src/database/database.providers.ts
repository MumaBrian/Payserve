import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
	{
		provide: 'DATA_SOURCE',
		useFactory: async (configService: ConfigService) => {
			const dataSource = new DataSource({
				type: 'postgres',
				host: configService.get<string>('database.host'),
				port: configService.get<number>('database.port'),
				username: configService.get<string>('database.username'),
				password: configService.get<string>('database.password'),
				database: configService.get<string>('database.name'),
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				synchronize: true,
			});

			return dataSource.initialize();
		},
		inject: [ConfigService],
	},
];
