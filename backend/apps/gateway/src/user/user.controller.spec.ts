import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { AuthService } from '../auth/auth.service'
import { USER_SERVICE, UserMessages } from '@app/shared'
import { of } from 'rxjs'

describe('UserController', () => {
	let controller: UserController
	let mockClientProxy: any
	let mockAuthService: any

	beforeEach(async () => {
		mockClientProxy = {
			send: jest.fn(),
		}

		mockAuthService = {
			login: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{ provide: USER_SERVICE, useValue: mockClientProxy },
				{ provide: AuthService, useValue: mockAuthService },
			],
		}).compile()

		controller = module.get<UserController>(UserController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('findAll -> devrait envoyer un message et retourner la liste des utilisateurs', (done) => {
		const mockUsers = [{ id: 1, email: 'test@test.com' }]
		mockClientProxy.send.mockReturnValue(of(mockUsers))

		controller.findAll().subscribe((result) => {
			expect(result).toEqual(mockUsers)
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				UserMessages.FIND_ALL_USERS,
				{},
			)
			done()
		})
	})

	it('findOne -> devrait retourner un utilisateur par son id', (done) => {
		const mockUser = { id: 1, email: 'test@test.com' }
		mockClientProxy.send.mockReturnValue(of(mockUser))

		controller.findOne(1).subscribe((result) => {
			expect(result).toEqual(mockUser)
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				UserMessages.FIND_ONE_USER,
				1,
			)
			done()
		})
	})

	it('create -> devrait envoyer les données de création au microservice', (done) => {
		const dto = {
			firstName: 'Bastien',
			lastName: 'Record',
			email: 'b@r.com',
			password: '123',
			role: 'user' as const,
			status: 1,
		}
		mockClientProxy.send.mockReturnValue(of({ id: 1, ...dto }))

		controller.create(dto).subscribe((result) => {
			expect(result).toHaveProperty('id')
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				UserMessages.CREATE_USER,
				dto,
			)
			done()
		})
	})

	it('update -> devrait envoyer l’id fusionné avec le body de mise à jour', (done) => {
		const dto = { firstName: 'Bastien Modif' }
		mockClientProxy.send.mockReturnValue(of({ id: 1, ...dto }))

		controller.update(1, dto).subscribe((result) => {
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				UserMessages.UPDATE_USER,
				{ ...dto, id: 1 },
			)
			done()
		})
	})

	it('delete -> devrait envoyer un ordre de suppression', (done) => {
		mockClientProxy.send.mockReturnValue(of({ deleted: true }))

		controller.delete(1).subscribe(() => {
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				UserMessages.DELETE_USER,
				1,
			)
			done()
		})
	})
})
