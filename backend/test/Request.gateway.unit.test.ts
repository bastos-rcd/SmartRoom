import { Test, TestingModule } from "@nestjs/testing";
import { RequestController } from "../apps/gateway/src/request/request.controller";
import { REQUEST_SERVICE, RequestMessages } from "@app/shared";
import { of } from "rxjs";

describe("Gateway - RequestController", () => {
  let controller: RequestController;
  let clientProxy: any;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: REQUEST_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    clientProxy = module.get(REQUEST_SERVICE);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should send a message to create a request", (done) => {
      const mockResult = {
        id: 1,
        type: "incident" as "incident" | "request",
        description: "test",
        status: 1,
        creationDate: new Date(),
        userId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.create(mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          RequestMessages.CREATE_REQUEST,
          mockResult,
        );
        done();
      });
    });
  });

  describe("findAll", () => {
    it("should send a message to retrieve all requests", (done) => {
      const mockResult = [
        {
          id: 1,
          type: "incident",
          description: "test",
          status: 1,
          creationDate: new Date(),
          userId: 1,
        },
      ];
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findAll().subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          RequestMessages.FIND_ALL_REQUESTS,
          {},
        );
        done();
      });
    });
  });

  describe("findOne", () => {
    it("should send a message with the correct ID", (done) => {
      const mockResult = {
        id: 1,
        type: "incident",
        description: "test",
        status: 1,
        creationDate: new Date(),
        userId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.findOne(1).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          RequestMessages.FIND_ONE_REQUEST,
          1,
        );
        done();
      });
    });
  });

  describe("update", () => {
    it("should send a message with the correct ID and payload", (done) => {
      const mockResult = {
        id: 1,
        type: "incident" as "incident" | "request",
        description: "test",
        status: 1,
        creationDate: new Date(),
        userId: 1,
      };
      clientProxy.send.mockReturnValue(of(mockResult));

      controller.update(1, mockResult).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(clientProxy.send).toHaveBeenCalledWith(
          RequestMessages.UPDATE_REQUEST,
          { ...mockResult, id: 1 },
        );
        done();
      });
    });
  });

  describe("delete", () => {
    it("should send a message to delete a request", (done) => {
      clientProxy.send.mockReturnValue(of(undefined));

      controller.delete(1).subscribe(() => {
        expect(clientProxy.send).toHaveBeenCalledWith(
          RequestMessages.DELETE_REQUEST,
          1,
        );
        done();
      });
    });
  });
});
