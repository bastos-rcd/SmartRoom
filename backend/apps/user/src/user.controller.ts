import { Controller } from '@nestjs/common'
import { UserMessages } from '@app/shared'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { User } from './user.entity'
import { UserService } from './user.service'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern(UserMessages.FIND_BY_EMAIL)
	async findByEmail(@Payload() email: string) {
		return this.userService.findByEmail(email)
	}

	@MessagePattern(UserMessages.FIND_ALL_USERS)
	async findAll(): Promise<User[]> {
		return this.userService.findAll()
	}

	@MessagePattern(UserMessages.FIND_ONE_USER)
	async findOne(id: number): Promise<User> {
		return this.userService.findOne(id)
	}

	@MessagePattern(UserMessages.CREATE_USER)
	async create(user: User): Promise<User> {
		return this.userService.create(user)
	}

	@MessagePattern(UserMessages.UPDATE_USER)
	async update(user: User): Promise<User> {
		return this.userService.update(user)
	}

	@MessagePattern(UserMessages.DELETE_USER)
	async delete(id: number): Promise<boolean> {
		return this.userService
			.delete(id)
			.then(() => true)
			.catch(() => false)
	}
}
