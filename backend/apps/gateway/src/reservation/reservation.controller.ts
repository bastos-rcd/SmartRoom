import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { RESERVATION_SERVICE, ReservationMessages } from "@app/shared";
import { Reservation } from "apps/reservation/src/reservation.entity";

@Controller("reservations")
export class ReservationController {
  constructor(
    @Inject(RESERVATION_SERVICE)
    private readonly reservationClient: ClientProxy,
  ) {}

  @Get()
  findAll(): Observable<any[]> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ALL_RESERVATIONS,
      {},
    );
  }

  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ONE_RESERVATION,
      Number(id),
    );
  }

  @Post("create")
  create(@Body() reservation: Reservation): Observable<Reservation> {
    return this.reservationClient.send(
      ReservationMessages.CREATE_RESERVATION,
      reservation,
    );
  }

  @Put("update/:id")
  update(
    @Param("id") id: number,
    @Body() reservation: Reservation,
  ): Observable<Reservation> {
    return this.reservationClient.send(ReservationMessages.UPDATE_RESERVATION, {
      ...reservation,
      id: Number(id),
    });
  }

  @Delete("delete/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.reservationClient.send(
      ReservationMessages.DELETE_RESERVATION,
      Number(id),
    );
  }
}
