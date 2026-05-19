import { Test, TestingModule } from "@nestjs/testing";
import { RoomController } from "./room.controller";
import { ROOM_SERVICE, RoomMessages } from "@app/shared";
import { of } from "rxjs";

describe("RoomController", () => {
  let controller: RoomController;
  let mockClientProxy: any;

  beforeEach(async () => {
    mockClientProxy = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{ provide: ROOM_SERVICE, useValue: mockClientProxy }],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it("findAll -> devrait lister les salles", (done) => {
    mockClientProxy.send.mockReturnValue(of([]));
    controller.findAll().subscribe(() => {
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        RoomMessages.FIND_ALL_ROOMS,
        {},
      );
      done();
    });
  });

  it("create -> devrait router vers le microservice room", (done) => {
    const dto = {
      name: "A101",
      capacity: 30,
      floor: 1,
      state: 1,
      location: "Nord",
      buildingId: 1,
    };
    mockClientProxy.send.mockReturnValue(of(dto));

    controller.create(dto).subscribe(() => {
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        RoomMessages.CREATE_ROOM,
        dto,
      );
      done();
    });
  });
});
