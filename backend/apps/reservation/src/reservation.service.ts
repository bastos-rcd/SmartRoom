import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Reservation } from "./reservation.entity";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    return reservation;
  }

  async create(reservation: Reservation): Promise<Reservation> {
    const newReservation = await this.reservationRepository.create(reservation);
    return await this.reservationRepository.save(newReservation);
  }

  async update(reservation: Reservation): Promise<Reservation> {
    const existingReservation = await this.reservationRepository.findOne({
      where: { id: reservation.id },
    });
    if (!existingReservation) {
      throw new Error("Reservation not found");
    }
    if (
      new Date(existingReservation.startDate).getTime() ===
        new Date(reservation.startDate).getTime() &&
      new Date(existingReservation.endDate).getTime() ===
        new Date(reservation.endDate).getTime() &&
      existingReservation.status === reservation.status &&
      existingReservation.comment === reservation.comment &&
      existingReservation.userId === reservation.userId &&
      existingReservation.roomId === reservation.roomId
    ) {
      throw new Error("No changes detected");
    }
    reservation.startDate = new Date(reservation.startDate);
    reservation.endDate = new Date(reservation.endDate);
    reservation.status = "modified";
    reservation.comment = reservation.comment;
    reservation.userId = reservation.userId;
    reservation.roomId = reservation.roomId;
    return await this.reservationRepository.save(reservation);
  }

  async delete(id: number): Promise<void> {
    const existingReservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!existingReservation) {
      throw new Error("Reservation not found");
    }
    await this.reservationRepository.delete(id);
  }
}
