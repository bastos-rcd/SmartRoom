import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Building } from './building.entity'

@Injectable()
export class BuildingService {
	constructor(
		@InjectRepository(Building)
		private readonly buildingRepository: Repository<Building>,
	) {}

	async findAll(): Promise<Building[]> {
		return this.buildingRepository.find()
	}

	async findOne(id: number): Promise<Building> {
		const building = await this.buildingRepository.findOne({
			where: { id },
		})
		if (!building) {
			throw new Error('Building not found')
		}
		return building
	}

	async create(building: Building): Promise<Building> {
		const newBuilding = await this.buildingRepository.create(building)
		return await this.buildingRepository.save(newBuilding)
	}

	async update(building: Building): Promise<Building> {
		const existingBuilding = await this.buildingRepository.findOne({
			where: { id: building.id },
		})
		if (!existingBuilding) {
			throw new Error('Building not found')
		}
		if (
			existingBuilding.name === building.name &&
			existingBuilding.address === building.address &&
			existingBuilding.nbFloors === building.nbFloors
		) {
			throw new Error('No changes detected')
		}
		existingBuilding.name = building.name
		existingBuilding.address = building.address
		existingBuilding.nbFloors = building.nbFloors
		return await this.buildingRepository.save(existingBuilding)
	}

	async delete(id: number): Promise<boolean> {
		const existingBuilding = await this.buildingRepository.findOne({
			where: { id },
		})
		if (!existingBuilding) {
			throw new Error('Building not found')
		}
		await this.buildingRepository.delete(id)
		return true
	}
}
