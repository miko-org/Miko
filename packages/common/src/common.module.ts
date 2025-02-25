import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as repositories from './database/repositories';
import * as services from './services';

@Global()
@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forRoot(),
		TypeOrmModule.forFeature(Object.values(repositories))
	],
	providers: Object.values(services),
	exports: Object.values(services)
})
export class CommonModule {}
