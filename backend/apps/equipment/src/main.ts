import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { EquipmentModule } from './equipment.module'

async function bootstrap() {
	const app = await NestFactory.create(EquipmentModule)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			host: '0.0.0.0',
			port: Number(process.env.EQUIPMENT_SERVICE_PORT) || 3004,
		},
	})

	await app.startAllMicroservices()
}
bootstrap()
