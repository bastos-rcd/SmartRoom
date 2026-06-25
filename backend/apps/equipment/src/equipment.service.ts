import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Equipment } from './equipment.entity'

@Injectable()
export class EquipmentService {
	constructor(
		@InjectRepository(Equipment)
		private readonly equipmentRepository: Repository<Equipment>,
	) {}

	async findAll(): Promise<Equipment[]> {
		return this.equipmentRepository.find()
	}

	async findOne(id: number): Promise<Equipment> {
		const equipment = await this.equipmentRepository.findOne({
			where: { id },
		})
		if (!equipment) {
			throw new Error('Equipment not found')
		}
		return equipment
	}

	async create(equipment: Equipment): Promise<Equipment> {
		const newEquipment = await this.equipmentRepository.create(equipment)
		return await this.equipmentRepository.save(newEquipment)
	}

	async update(equipment: Equipment): Promise<Equipment> {
		const existingEquipment = await this.equipmentRepository.findOne({
			where: { id: equipment.id },
		})
		if (!existingEquipment) {
			throw new Error('Equipment not found')
		}
		if (
			existingEquipment.name === equipment.name &&
			existingEquipment.type === equipment.type &&
			existingEquipment.available === equipment.available &&
			existingEquipment.roomId === equipment.roomId
		) {
			throw new Error('No changes detected')
		}
		existingEquipment.name = equipment.name
		existingEquipment.type = equipment.type
		existingEquipment.available = equipment.available
		existingEquipment.roomId = equipment.roomId
		return await this.equipmentRepository.save(existingEquipment)
	}

	async delete(id: number): Promise<boolean> {
		const existingEquipment = await this.equipmentRepository.findOne({
			where: { id },
		})
		if (!existingEquipment) {
			throw new Error('Equipment not found')
		}
		await this.equipmentRepository.delete(id)
		return true
	}
}
