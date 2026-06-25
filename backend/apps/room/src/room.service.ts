import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Room } from './room.entity'

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room)
		private readonly roomRepository: Repository<Room>,
	) {}

	async findAll(): Promise<Room[]> {
		return this.roomRepository.find()
	}

	async findOne(id: number): Promise<Room> {
		const room = await this.roomRepository.findOne({
			where: { id },
		})
		if (!room) {
			throw new Error('Room not found')
		}
		return room
	}

	async create(room: Room): Promise<Room> {
		const newRoom = await this.roomRepository.create(room)
		return await this.roomRepository.save(newRoom)
	}

	async update(room: Room): Promise<Room> {
		const existingRoom = await this.roomRepository.findOne({
			where: { id: room.id },
		})
		if (!existingRoom) {
			throw new Error('Room not found')
		}
		if (
			existingRoom.name === room.name &&
			existingRoom.capacity === room.capacity &&
			existingRoom.floor === room.floor &&
			existingRoom.state === room.state &&
			existingRoom.location === room.location
		) {
			throw new Error('No changes detected')
		}
		return await this.roomRepository.save(room)
	}

	async delete(id: number): Promise<boolean> {
		const existingRoom = await this.roomRepository.findOne({
			where: { id },
		})
		if (!existingRoom) {
			throw new Error('Room not found')
		}
		await this.roomRepository.delete(id)
		return true
	}
}
