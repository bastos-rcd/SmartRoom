import { Test, TestingModule } from "@nestjs/testing";
import { ReservationController } from "../apps/gateway/src/reservation/reservation.controller";
import { RESERVATION_SERVICE, ReservationMessages } from "@app/shared";
import { of } from "rxjs";

describe("Gateway - ReservationController", () => {
  let controller: ReservationController;
  let clientProxy: any;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: RESERVATION_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    clientProxy = module.get(RESERVATION_SERVICE);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should send a message to create a reservation", (done) => {
      const startDate = new Date();
      const mockResult = {
        id: 1,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 24),
        status: "confirmed" as "confirmed" | "cancelled" | "modified",
        comment: "test",
        userId: 1,
        roomId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.create(mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ReservationMessages.CREATE_RESERVATION,
          mockResult,
        );
        done();
      });
    });
  });

  describe("findAll", () => {
    it("should send a message to retrieve all reservations", (done) => {
      const startDate = new Date();
      const mockResult = [
        {
          id: 1,
          startDate: startDate,
          endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 24),
          status: "confirmed",
          comment: "test",
          userId: 1,
          roomId: 1,
        },
      ];
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findAll().subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ReservationMessages.FIND_ALL_RESERVATIONS,
          {},
        );
        done();
      });
    });
  });

  describe("findOne", () => {
    it("should send a message with the correct ID", (done) => {
      const startDate = new Date();
      const mockResult = {
        id: 1,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 24),
        status: "confirmed",
        comment: "test",
        userId: 1,
        roomId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findOne(1).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ReservationMessages.FIND_ONE_RESERVATION,
          1,
        );
        done();
      });
    });
  });

  describe("update", () => {
    it("should send a message with the correct ID and payload", (done) => {
      const startDate = new Date();
      const mockResult = {
        id: 1,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 24),
        status: "modified" as "confirmed" | "cancelled" | "modified",
        comment: "test",
        userId: 1,
        roomId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.update(1, mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ReservationMessages.UPDATE_RESERVATION,
          { ...mockResult, id: 1 },
        );
        done();
      });
    });
  });

  describe("delete", () => {
    it("should send a message to delete a reservation", (done) => {
      clientProxy.send.mockReturnValue(of(undefined));

      controller.delete(1).subscribe(() => {
        expect(clientProxy.send).toHaveBeenCalledWith(
          ReservationMessages.DELETE_RESERVATION,
          1,
        );
        done();
      });
    });
  });
});
