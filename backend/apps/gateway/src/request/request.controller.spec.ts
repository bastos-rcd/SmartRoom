import { Test, TestingModule } from '@nestjs/testing'
import { RequestController } from './request.controller'
import { REQUEST_SERVICE, RequestMessages } from '@app/shared'
import { of } from 'rxjs'

describe('RequestController', () => {
	let controller: RequestController
	let mockClientProxy: any

	beforeEach(async () => {
		mockClientProxy = { send: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			controllers: [RequestController],
			providers: [{ provide: REQUEST_SERVICE, useValue: mockClientProxy }],
		}).compile()

		controller = module.get<RequestController>(RequestController)
	})

	it('update -> devrait envoyer le patch de ticket', (done) => {
		const dto = { status: 0 }
		mockClientProxy.send.mockReturnValue(of(dto))

		controller.update(2, dto).subscribe(() => {
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				RequestMessages.UPDATE_REQUEST,
				{ ...dto, id: 2 },
			)
			done()
		})
	})
})
