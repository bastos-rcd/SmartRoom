import { Test, TestingModule } from "@nestjs/testing";
import { BuildingController } from "./building.controller";
import { BUILDING_SERVICE, BuildingMessages } from "@app/shared";
import { of } from "rxjs";

describe("BuildingController", () => {
  let controller: BuildingController;
  let mockClientProxy: any;

  beforeEach(async () => {
    mockClientProxy = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [{ provide: BUILDING_SERVICE, useValue: mockClientProxy }],
    }).compile();

    controller = module.get<BuildingController>(BuildingController);
  });

  it("findAll -> devrait renvoyer tous les bâtiments", (done) => {
    const mockBuildings = [
      { id: 1, name: "Main", address: "Toulouse", nbFloors: 3 },
    ];
    mockClientProxy.send.mockReturnValue(of(mockBuildings));

    controller.findAll().subscribe((res) => {
      expect(res).toEqual(mockBuildings);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        BuildingMessages.FIND_ALL_BUILDINGS,
        {},
      );
      done();
    });
  });

  it("findOne -> devrait renvoyer un bâtiment par ID", (done) => {
    const mockBuilding = { id: 1, name: "Main" };
    mockClientProxy.send.mockReturnValue(of(mockBuilding));

    controller.findOne(1).subscribe((res) => {
      expect(res).toEqual(mockBuilding);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        BuildingMessages.FIND_ONE_BUILDING,
        1,
      );
      done();
    });
  });

  it("create -> devrait appeler le pattern de création", (done) => {
    const dto = { name: "New", address: "Paris", nbFloors: 2 };
    mockClientProxy.send.mockReturnValue(of({ id: 2, ...dto }));

    controller.create(dto).subscribe((res) => {
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        BuildingMessages.CREATE_BUILDING,
        dto,
      );
      done();
    });
  });
});
