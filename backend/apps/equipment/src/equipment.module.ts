import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EquipmentController } from './equipment.controller'
import { EquipmentService } from './equipment.service'
import { Equipment } from './equipment.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_NAME || 'smartroomdb',
			entities: [Equipment],
			synchronize: false,
		}),
		TypeOrmModule.forFeature([Equipment]),
	],
	controllers: [EquipmentController],
	providers: [EquipmentService],
})
export class EquipmentModule {}
