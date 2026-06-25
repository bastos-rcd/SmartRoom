import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { RequestMessages } from '@app/shared'

import { RequestService } from './request.service'
import { Request } from './request.entity'

@Controller()
export class RequestController {
	constructor(private readonly requestService: RequestService) {}

	@MessagePattern(RequestMessages.FIND_ALL_REQUESTS)
	async findAll(): Promise<Request[]> {
		return this.requestService.findAll()
	}

	@MessagePattern(RequestMessages.FIND_ONE_REQUEST)
	async findOne(id: number): Promise<Request> {
		return this.requestService.findOne(id)
	}

	@MessagePattern(RequestMessages.CREATE_REQUEST)
	async create(request: Request): Promise<Request> {
		return this.requestService.create(request)
	}

	@MessagePattern(RequestMessages.UPDATE_REQUEST)
	async update(request: Request): Promise<Request> {
		return this.requestService.update(request)
	}

	@MessagePattern(RequestMessages.DELETE_REQUEST)
	async delete(id: number): Promise<void> {
		return this.requestService.delete(id)
	}
}
