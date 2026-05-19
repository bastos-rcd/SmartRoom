import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RequestService } from "../apps/request/src/request.service";
import { Request } from "../apps/request/src/request.entity";
import { Repository } from "typeorm";

describe("RequestService", () => {
  let service: RequestService;
  let repository: Repository<Request>;

  // Mock du Repository
  const mockRequestRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRequestRepository,
        },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    repository = module.get<Repository<Request>>(getRepositoryToken(Request));
  });

  describe("create", () => {
    it("should create a request", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const inputRequest = {
        type: "incident",
        description: "test",
        status: 1,
        userId: user.id,
      };
      const savedRequest = {
        id: 1,
        ...inputRequest,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      jest.spyOn(repository, "create").mockReturnValue(savedRequest as Request);
      jest.spyOn(repository, "save").mockResolvedValue(savedRequest as Request);

      const result = await service.create(inputRequest as Request);

      expect(result).toEqual(savedRequest);
      expect(repository.create).toHaveBeenCalledWith(inputRequest);
      expect(repository.save).toHaveBeenCalledWith(savedRequest);
    });
  });

  describe("findAll", () => {
    it("should return all requests", async () => {
      const expectedRequests = [
        { id: 1, type: "incident", description: "test", status: 1, userId: 1 },
        { id: 2, type: "request", description: "test", status: 1, userId: 1 },
      ];
      jest
        .spyOn(repository, "find")
        .mockResolvedValue(expectedRequests as Request[]);

      const result = await service.findAll();

      expect(result).toEqual(expectedRequests);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a request if the ID exists", async () => {
      const expectedRequest = {
        id: 1,
        type: "incident",
        description: "test",
        status: 1,
        userId: 1,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(expectedRequest as Request);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedRequest);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("update", () => {
    it("should update a request if the ID exists", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const existingRequest = {
        id: 1,
        type: "incident",
        description: "test",
        status: 1,
        userId: user.id,
      };
      const updatedRequest = {
        id: existingRequest.id,
        type: "request",
        description: "test",
        status: 1,
        userId: user.id,
      } as Request;
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(existingRequest as Request);
      jest.spyOn(repository, "save").mockResolvedValue(updatedRequest);

      const result = await service.update(updatedRequest as Request);

      expect(result).toEqual(updatedRequest);
      expect(repository.save).toHaveBeenCalledWith(updatedRequest);
    });
  });

  describe("delete", () => {
    it("should delete a request if the ID exists", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const inputRequest = {
        type: "incident",
        description: "test",
        status: 1,
        userId: user.id,
      };
      const savedRequest = {
        id: 1,
        ...inputRequest,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(savedRequest as Request);
      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
