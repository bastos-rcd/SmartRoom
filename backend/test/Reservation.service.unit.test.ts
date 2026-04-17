import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ReservationService } from "../apps/reservation/src/reservation.service";
import { Reservation } from "../apps/reservation/src/reservation.entity";
import { Repository } from "typeorm";

describe("ReservationService", () => {
  let service: ReservationService;
  let repository: Repository<Reservation>;

  // Mock du Repository
  const mockReservationRepository = {
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
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );
  });

  describe("create", () => {
    it("should create a reservation", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const room = {
        id: 1,
        name: "room1",
        capacity: 10,
        floor: 1,
        state: 1,
        location: "test",
        buildingId: 1,
      };
      const inputReservation = {
        startDate: new Date(),
        endDate: new Date(),
        comment: "test",
        userId: user.id,
        roomId: room.id,
      };
      const savedReservation = {
        id: 1,
        status: "confirmed",
        ...inputReservation,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      jest
        .spyOn(repository, "create")
        .mockReturnValue(savedReservation as Reservation);
      jest
        .spyOn(repository, "save")
        .mockResolvedValue(savedReservation as Reservation);

      const result = await service.create(inputReservation as Reservation);

      expect(result).toEqual(savedReservation);
      expect(repository.create).toHaveBeenCalledWith(inputReservation);
      expect(repository.save).toHaveBeenCalledWith(savedReservation);
    });
  });

  describe("findAll", () => {
    it("should return all reservations", async () => {
      const expectedReservations = [
        {
          id: 1,
          startDate: new Date(),
          endDate: new Date(),
          status: "confirmed",
          comment: "test",
          userId: 1,
          roomId: 1,
        },
        {
          id: 2,
          startDate: new Date(),
          endDate: new Date(),
          status: "confirmed",
          comment: "test",
          userId: 1,
          roomId: 1,
        },
      ];
      jest
        .spyOn(repository, "find")
        .mockResolvedValue(expectedReservations as Reservation[]);

      const result = await service.findAll();

      expect(result).toEqual(expectedReservations);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a reservation if the ID exists", async () => {
      const startDate = new Date();
      const expectedReservation = {
        id: 1,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 2),
        status: "confirmed",
        comment: "test",
        userId: 1,
        roomId: 1,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(expectedReservation as Reservation);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedReservation);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("update", () => {
    it("should update a reservation if the ID exists", async () => {
      const startDate = new Date();
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const room = {
        id: 1,
        name: "room1",
        capacity: 10,
        floor: 1,
        state: 1,
        location: "test",
        buildingId: 1,
      };
      const existingReservation = {
        id: 1,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 2),
        status: "confirmed" as "confirmed" | "cancelled" | "modified",
        comment: "test",
        userId: user.id,
        roomId: room.id,
      };
      const updatedReservation = {
        id: existingReservation.id,
        startDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 1),
        endDate: new Date(startDate.getTime() + 1000 * 60 * 60 * 3),
        status: "modified",
        comment: "test",
        userId: user.id,
        roomId: room.id,
      } as Reservation;
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(existingReservation as Reservation);
      jest.spyOn(repository, "save").mockResolvedValue(updatedReservation);

      const result = await service.update(updatedReservation as Reservation);

      expect(result).toEqual(updatedReservation);
      expect(repository.save).toHaveBeenCalledWith(updatedReservation);
    });
  });

  describe("delete", () => {
    it("should delete a reservation if the ID exists", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        status: 1,
      };
      const room = {
        id: 1,
        name: "room1",
        capacity: 10,
        floor: 1,
        state: 1,
        location: "test",
        buildingId: 1,
      };
      const inputReservation = {
        startDate: new Date(),
        endDate: new Date(),
        comment: "test",
        userId: user.id,
        roomId: room.id,
      };
      const savedReservation = {
        id: 1,
        ...inputReservation,
      };
      jest
        .spyOn(repository, "findOne")
        .mockResolvedValue(savedReservation as Reservation);
      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
