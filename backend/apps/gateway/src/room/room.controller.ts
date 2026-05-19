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

import { ROOM_SERVICE, RoomMessages } from "@app/shared";
import { Room } from "apps/room/src/room.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomResponseDto } from "./dto/room-response.dto";

@ApiTags("Salles")
@ApiBearerAuth("JWT-auth")
@Controller("rooms")
export class RoomController {
  constructor(
    @Inject(ROOM_SERVICE)
    private readonly roomClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  @ApiOperation({ summary: "Récupérer la liste de toutes les salles" })
  @ApiOkResponse({
    type: [RoomResponseDto],
    description: "Liste des salles retournée avec succès.",
  })
  @ApiResponse({
    status: 401,
    description: "Token JWT manquant, expiré ou invalide.",
  })
  findAll(): Observable<any[]> {
    return this.roomClient.send(RoomMessages.FIND_ALL_ROOMS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  @ApiOperation({ summary: "Récupérer les détails d'une salle par son ID" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID unique de la salle",
    example: 1,
  })
  @ApiOkResponse({ type: RoomResponseDto, description: "Salle trouvée." })
  @ApiResponse({ status: 401, description: "Authentification requise." })
  @ApiResponse({ status: 404, description: "La salle demandée n'existe pas." })
  findOne(@Param("id") id: number): Observable<any> {
    return this.roomClient.send(RoomMessages.FIND_ONE_ROOM, Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  @ApiOperation({ summary: "[ADMIN] Créer une nouvelle salle" })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
    status: 201,
    type: RoomResponseDto,
    description: "La salle a été créée avec succès.",
  })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  create(@Body() room: CreateRoomDto): Observable<Room> {
    return this.roomClient.send(RoomMessages.CREATE_ROOM, room);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("/:id")
  @ApiOperation({ summary: "[ADMIN] Modifier les informations d'une salle" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de la salle à modifier",
    example: 1,
  })
  @ApiBody({ type: UpdateRoomDto })
  @ApiOkResponse({
    type: RoomResponseDto,
    description: "La salle a été mise à jour avec succès.",
  })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  update(
    @Param("id") id: number,
    @Body() room: UpdateRoomDto,
  ): Observable<Room> {
    return this.roomClient.send(RoomMessages.UPDATE_ROOM, {
      ...room,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  @ApiOperation({ summary: "[ADMIN] Supprimer définitivement une salle" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de la salle à supprimer",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      "La salle ainsi que ses dépendances (ON DELETE CASCADE) ont été supprimées.",
  })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  delete(@Param("id") id: number): Observable<void> {
    return this.roomClient.send(RoomMessages.DELETE_ROOM, Number(id));
  }
}
