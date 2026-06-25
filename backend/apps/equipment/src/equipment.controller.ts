import { Controller } from '@nestjs/common'
import { EquipmentService } from './equipment.service'
import { MessagePattern } from '@nestjs/microservices'

import { EquipmentMessages } from '@app/shared'
import { Equipment } from './equipment.entity'

@Controller()
export class EquipmentController {
	constructor(private readonly equipmentService: EquipmentService) {}

	@MessagePattern(EquipmentMessages.FIND_ALL_EQUIPMENTS)
	async findAll(): Promise<Equipment[]> {
		return this.equipmentService.findAll()
	}

	@MessagePattern(EquipmentMessages.FIND_ONE_EQUIPMENT)
	async findOne(id: number): Promise<Equipment> {
		return this.equipmentService.findOne(id)
	}

	@MessagePattern(EquipmentMessages.CREATE_EQUIPMENT)
	async create(equipment: Equipment): Promise<Equipment> {
		return this.equipmentService.create(equipment)
	}

	@MessagePattern(EquipmentMessages.UPDATE_EQUIPMENT)
	async update(equipment: Equipment): Promise<Equipment> {
		return this.equipmentService.update(equipment)
	}

	@MessagePattern(EquipmentMessages.DELETE_EQUIPMENT)
	async delete(id: number): Promise<boolean> {
		return this.equipmentService
			.delete(id)
			.then(() => true)
			.catch(() => false)
	}
}
