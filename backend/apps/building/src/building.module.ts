import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BuildingController } from './building.controller'
import { BuildingService } from './building.service'
import { Building } from './building.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_NAME || 'smartroomdb',
			entities: [Building],
			synchronize: false,
		}),
		TypeOrmModule.forFeature([Building]),
	],
	controllers: [BuildingController],
	providers: [BuildingService],
})
export class BuildingModule {}
