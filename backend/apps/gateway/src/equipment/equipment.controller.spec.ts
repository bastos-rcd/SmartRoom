import { Test, TestingModule } from '@nestjs/testing'
import { EquipmentController } from './equipment.controller'
import { EQUIPMENT_SERVICE, EquipmentMessages } from '@app/shared'
import { of } from 'rxjs'

describe('EquipmentController', () => {
	let controller: EquipmentController
	let mockClientProxy: any

	beforeEach(async () => {
		mockClientProxy = { send: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			controllers: [EquipmentController],
			providers: [{ provide: EQUIPMENT_SERVICE, useValue: mockClientProxy }],
		}).compile()

		controller = module.get<EquipmentController>(EquipmentController)
	})

	it('findOne -> devrait router la demande d’ID', (done) => {
		mockClientProxy.send.mockReturnValue(of({ id: 5 }))
		controller.findOne(5).subscribe((res) => {
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				EquipmentMessages.FIND_ONE_EQUIPMENT,
				5,
			)
			done()
		})
	})
})
