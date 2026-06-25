import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ReservationController } from './reservation.controller'
import { ReservationService } from './reservation.service'
import { Reservation } from './reservation.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_NAME || 'smartroomdb',
			entities: [Reservation],
			synchronize: false,
		}),
		TypeOrmModule.forFeature([Reservation]),
	],
	controllers: [ReservationController],
	providers: [ReservationService],
})
export class ReservationModule {}
