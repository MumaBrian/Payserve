import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
	constructor(
		@Inject('DATA_SOURCE')
		private dataSource: DataSource,
	) {}

	getDataSource(): DataSource {
		return this.dataSource;
	}
}
