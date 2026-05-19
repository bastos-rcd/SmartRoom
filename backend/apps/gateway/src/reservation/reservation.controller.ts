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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

import { RESERVATION_SERVICE, ReservationMessages } from "@app/shared";
import { Reservation } from "apps/reservation/src/reservation.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationResponseDto } from "./dto/reservation-response.dto";

@ApiTags("Réservations")
@ApiBearerAuth("JWT-auth")
@Controller("reservations")
export class ReservationController {
  constructor(
    @Inject(RESERVATION_SERVICE)
    private readonly reservationClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  @ApiOperation({ summary: "Récupérer la liste de toutes les réservations" })
  @ApiOkResponse({
    type: [ReservationResponseDto],
    description: "Liste des réservations récupérée avec succès.",
  })
  @ApiResponse({
    status: 401,
    description: "Authentification requise (Token manquant ou expiré).",
  })
  findAll(): Observable<any[]> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ALL_RESERVATIONS,
      {},
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  @ApiOperation({ summary: "Récupérer une réservation par son ID" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID unique de la réservation",
    example: 1,
  })
  @ApiOkResponse({
    type: ReservationResponseDto,
    description: "Réservation trouvée.",
  })
  @ApiResponse({
    status: 404,
    description: "La réservation demandée n'existe pas.",
  })
  findOne(@Param("id") id: number): Observable<any> {
    return this.reservationClient.send(
      ReservationMessages.FIND_ONE_RESERVATION,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  @ApiOperation({ summary: "Créer une nouvelle réservation de salle" })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    type: ReservationResponseDto,
    description: "La réservation a été enregistrée.",
  })
  @ApiResponse({
    status: 400,
    description: "Données de date invalides ou conflit de réservation.",
  })
  create(@Body() reservation: CreateReservationDto): Observable<Reservation> {
    return this.reservationClient.send(
      ReservationMessages.CREATE_RESERVATION,
      reservation,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  @ApiOperation({ summary: "Modifier une réservation existante" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de la réservation à mettre à jour",
    example: 1,
  })
  @ApiBody({ type: UpdateReservationDto })
  @ApiOkResponse({
    type: ReservationResponseDto,
    description: "La réservation a été mise à jour.",
  })
  update(
    @Param("id") id: number,
    @Body() reservation: UpdateReservationDto,
  ): Observable<Reservation> {
    return this.reservationClient.send(ReservationMessages.UPDATE_RESERVATION, {
      ...reservation,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  @ApiOperation({ summary: "Supprimer une réservation" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de la réservation à supprimer",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "La réservation a été retirée de la base de données.",
  })
  delete(@Param("id") id: number): Observable<void> {
    return this.reservationClient.send(
      ReservationMessages.DELETE_RESERVATION,
      Number(id),
    );
  }
}
