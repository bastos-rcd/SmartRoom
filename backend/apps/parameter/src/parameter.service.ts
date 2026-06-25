import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Parameter } from './parameter.entity'

@Injectable()
export class ParameterService {
	constructor(
		@InjectRepository(Parameter)
		private readonly parameterRepository: Repository<Parameter>,
	) {}

	async findAll(): Promise<Parameter[]> {
		return this.parameterRepository.find()
	}

	async findOne(id: number): Promise<Parameter> {
		const parameter = await this.parameterRepository.findOne({
			where: { id },
		})
		if (!parameter) {
			throw new Error('Parameter not found')
		}
		return parameter
	}

	async create(parameter: Parameter): Promise<Parameter> {
		const existingParameter = await this.parameterRepository.findOne({
			where: { name: parameter.name },
		})
		if (existingParameter) {
			throw new Error('Parameter already exists')
		}
		const newParameter = await this.parameterRepository.create(parameter)
		return await this.parameterRepository.save(newParameter)
	}

	async update(parameter: Parameter): Promise<Parameter> {
		const existingParameter = await this.parameterRepository.findOne({
			where: { id: parameter.id },
		})
		if (!existingParameter) {
			throw new Error('Parameter not found')
		}
		if (
			existingParameter.name === parameter.name &&
			existingParameter.value === parameter.value &&
			existingParameter.userId === parameter.userId
		) {
			throw new Error('No changes detected')
		}
		parameter.name = parameter.name
		parameter.value = parameter.value
		parameter.userId = parameter.userId
		return await this.parameterRepository.save(parameter)
	}

	async delete(id: number): Promise<boolean> {
		const existingParameter = await this.parameterRepository.findOne({
			where: { id },
		})
		if (!existingParameter) {
			throw new Error('Parameter not found')
		}
		await this.parameterRepository.delete(id)
		return true
	}
}
