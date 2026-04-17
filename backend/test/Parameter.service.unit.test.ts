import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ParameterService } from "../apps/parameter/src/parameter.service";
import { Parameter } from "../apps/parameter/src/parameter.entity";
import { Repository } from "typeorm";

describe("ParameterService", () => {
  let service: ParameterService;
  let repository: Repository<Parameter>;

  // Mock du Repository
  const mockParameterRepository = {
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
        ParameterService,
        {
          provide: getRepositoryToken(Parameter),
          useValue: mockParameterRepository,
        },
      ],
    }).compile();

    service = module.get<ParameterService>(ParameterService);
    repository = module.get<Repository<Parameter>>(
      getRepositoryToken(Parameter),
    );
  });

  describe("create", () => {
    it("should create a parameter", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const inputParameter = {
        name: "maintenance",
        value: "off",
        userId: user.id,
      };
      const savedParameter = {
        id: 1,
        ...inputParameter,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      jest
        .spyOn(repository, "create")
        .mockReturnValue(savedParameter as Parameter);
      jest
        .spyOn(repository, "save")
        .mockResolvedValue(savedParameter as Parameter);

      const result = await service.create(inputParameter as Parameter);

      expect(result).toEqual(savedParameter);
      expect(repository.create).toHaveBeenCalledWith(inputParameter);
      expect(repository.save).toHaveBeenCalledWith(savedParameter);
    });
  });

  describe("findAll", () => {
    it("should return all parameters", async () => {
      const expectedParameters = [
        { id: 1, name: "maintenance", value: "off" },
        { id: 2, name: "theme", value: "dark" },
      ];
      jest
        .spyOn(repository, "find")
        .mockResolvedValue(expectedParameters as Parameter[]);

      const result = await service.findAll();

      expect(result).toEqual(expectedParameters);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a parameter if the ID exists", async () => {
      const expectedParameter = { id: 1, name: "maintenance", value: "off" };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(expectedParameter as Parameter);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedParameter);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("update", () => {
    it("should update a parameter if the ID exists", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const existingParameter = {
        id: 1,
        name: "maintenance",
        value: "off",
        userId: user.id,
      };
      const updatedParameter = {
        id: existingParameter.id,
        name: "maintenance",
        value: "on",
        userId: user.id,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(existingParameter as Parameter);
      jest.spyOn(repository, "save").mockResolvedValue(updatedParameter);

      const result = await service.update(updatedParameter as Parameter);

      expect(result).toEqual(updatedParameter);
      expect(repository.save).toHaveBeenCalledWith(updatedParameter);
    });
  });

  describe("delete", () => {
    it("should delete a parameter if the ID exists", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const inputParameter = {
        name: "maintenance",
        value: "off",
        userId: user.id,
      };
      const savedParameter = {
        id: 1,
        ...inputParameter,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(savedParameter as Parameter);
      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
