import { Test, TestingModule } from "@nestjs/testing";
import { ParameterController } from "../apps/gateway/src/parameter/parameter.controller";
import { PARAMETER_SERVICE, ParameterMessages } from "@app/shared";
import { of } from "rxjs";

describe("Gateway - ParameterController", () => {
  let controller: ParameterController;
  let clientProxy: any;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParameterController],
      providers: [
        {
          provide: PARAMETER_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<ParameterController>(ParameterController);
    clientProxy = module.get(PARAMETER_SERVICE);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should send a message to create a parameter", (done) => {
      const mockResult = { id: 1, name: "theme", value: "dark", userId: 1 };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.create(mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ParameterMessages.CREATE_PARAMETER,
          mockResult,
        );
        done();
      });
    });
  });

  describe("findAll", () => {
    it("should send a message to retrieve all parameters", (done) => {
      const mockResult = [{ id: 1, name: "theme", value: "dark" }];
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findAll().subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ParameterMessages.FIND_ALL_PARAMETERS,
          {},
        );
        done();
      });
    });
  });

  describe("findOne", () => {
    it("should send a message with the correct ID", (done) => {
      const mockResult = { id: 1, name: "theme", value: "dark" };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findOne(1).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ParameterMessages.FIND_ONE_PARAMETER,
          1,
        );
        done();
      });
    });
  });

  describe("update", () => {
    it("should send a message with the correct ID and payload", (done) => {
      const mockResult = { id: 1, name: "theme", value: "dark", userId: 1 };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.update(1, mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          ParameterMessages.UPDATE_PARAMETER,
          { ...mockResult, id: 1 },
        );
        done();
      });
    });
  });

  describe("delete", () => {
    it("should send a message to delete a parameter", (done) => {
      clientProxy.send.mockReturnValue(of(undefined));

      controller.delete(1).subscribe(() => {
        expect(clientProxy.send).toHaveBeenCalledWith(
          ParameterMessages.DELETE_PARAMETER,
          1,
        );
        done();
      });
    });
  });
});
