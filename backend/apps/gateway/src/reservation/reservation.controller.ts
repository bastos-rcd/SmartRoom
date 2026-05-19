import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { RESERVATION_SERVICE, ReservationMessages } from "@app/shared";
import { Reservation } from "apps/reservation/src/reservation.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("reservations")
export class ReservationController {
  constructor(
    @Inject(RESERVATION_SERVICE)
    private readonly reservationClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ALL_RESERVATIONS,
      {},
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ONE_RESERVATION,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  create(@Body() reservation: Reservation): Observable<Reservation> {
    return this.reservationClient.send(
      ReservationMessages.CREATE_RESERVATION,
      reservation,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() reservation: Reservation,
  ): Observable<Reservation> {
    return this.reservationClient.send(ReservationMessages.UPDATE_RESERVATION, {
      ...reservation,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.reservationClient.send(
      ReservationMessages.DELETE_RESERVATION,
      Number(id),
    );
  }
}
