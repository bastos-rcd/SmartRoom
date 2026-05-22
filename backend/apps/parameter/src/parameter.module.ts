import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ParameterController } from './parameter.controller'
import { ParameterService } from './parameter.service'
import { Parameter } from './parameter.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_NAME || 'smartroomdb',
			entities: [Parameter],
			synchronize: false,
		}),
		TypeOrmModule.forFeature([Parameter]),
	],
	controllers: [ParameterController],
	providers: [ParameterService],
})
export class ParameterModule {}
