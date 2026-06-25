import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { BUILDING_SERVICE } from '@app/shared'

import { BuildingController } from './building.controller'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: BUILDING_SERVICE,
				transport: Transport.TCP,
				options: {
					host: process.env.BUILDING_SERVICE_HOST || 'localhost',
					port: Number(process.env.BUILDING_SERVICE_PORT) || 3002,
				},
			},
		]),
	],
	controllers: [BuildingController],
})
export class BuildingModule {}
