import { Controller } from '@nestjs/common'
import { RoomMessages } from '@app/shared'
import { MessagePattern } from '@nestjs/microservices'

import { RoomService } from './room.service'
import { Room } from './room.entity'

@Controller()
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@MessagePattern(RoomMessages.FIND_ALL_ROOMS)
	async findAll(): Promise<Room[]> {
		return this.roomService.findAll()
	}

	@MessagePattern(RoomMessages.FIND_ONE_ROOM)
	async findOne(id: number): Promise<Room> {
		return this.roomService.findOne(id)
	}

	@MessagePattern(RoomMessages.CREATE_ROOM)
	async create(room: Room): Promise<Room> {
		return this.roomService.create(room)
	}

	@MessagePattern(RoomMessages.UPDATE_ROOM)
	async update(room: Room): Promise<Room> {
		return this.roomService.update(room)
	}

	@MessagePattern(RoomMessages.DELETE_ROOM)
	async delete(id: number): Promise<void> {
		return this.roomService.delete(id)
	}
}
