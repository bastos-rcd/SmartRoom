import { Test, TestingModule } from '@nestjs/testing'
import { ReservationController } from './reservation.controller'
import { RESERVATION_SERVICE, ReservationMessages } from '@app/shared'
import { of } from 'rxjs'

describe('ReservationController', () => {
	let controller: ReservationController
	let mockClientProxy: any

	beforeEach(async () => {
		mockClientProxy = { send: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReservationController],
			providers: [{ provide: RESERVATION_SERVICE, useValue: mockClientProxy }],
		}).compile()

		controller = module.get<ReservationController>(ReservationController)
	})

	it('create -> devrait pousser la réservation', (done) => {
		const dto = {
			startDate: new Date(),
			endDate: new Date(),
			status: 'confirmed' as const,
			comment: 'Ok',
			userId: 1,
			roomId: 1,
		}
		mockClientProxy.send.mockReturnValue(of(dto))

		controller.create(dto).subscribe(() => {
			expect(mockClientProxy.send).toHaveBeenCalledWith(
				ReservationMessages.CREATE_RESERVATION,
				dto,
			)
			done()
		})
	})
})
