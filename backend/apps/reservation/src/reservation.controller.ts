import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ReservationMessages } from '@app/shared'

import { ReservationService } from './reservation.service'
import { Reservation } from './reservation.entity'

@Controller()
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) {}

	@MessagePattern(ReservationMessages.FIND_ALL_RESERVATIONS)
	async findAll(): Promise<Reservation[]> {
		return this.reservationService.findAll()
	}

	@MessagePattern(ReservationMessages.FIND_ONE_RESERVATION)
	async findOne(id: number): Promise<Reservation> {
		return this.reservationService.findOne(id)
	}

	@MessagePattern(ReservationMessages.CREATE_RESERVATION)
	async create(reservation: Reservation): Promise<Reservation> {
		return this.reservationService.create(reservation)
	}

	@MessagePattern(ReservationMessages.UPDATE_RESERVATION)
	async update(reservation: Reservation): Promise<Reservation> {
		return this.reservationService.update(reservation)
	}

	@MessagePattern(ReservationMessages.DELETE_RESERVATION)
	async delete(id: number): Promise<boolean> {
		return this.reservationService
			.delete(id)
			.then(() => true)
			.catch(() => false)
	}
}
