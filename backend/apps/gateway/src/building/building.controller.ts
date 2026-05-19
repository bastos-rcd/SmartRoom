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

import { BUILDING_SERVICE, BuildingMessages } from "@app/shared";
import { Building } from "apps/building/src/building.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

import { CreateBuildingDto } from "./dto/create-building.dto";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { BuildingResponseDto } from "./dto/building-response.dto";

@ApiTags("Bâtiments")
@ApiBearerAuth("JWT-auth")
@Controller("buildings")
export class BuildingController {
  constructor(
    @Inject(BUILDING_SERVICE)
    private readonly buildingClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  @ApiOperation({ summary: "Récupérer la liste de tous les bâtiments" })
  @ApiOkResponse({
    type: [BuildingResponseDto],
    description: "Liste des bâtiments récupérée avec succès.",
  })
  @ApiResponse({ status: 401, description: "Token JWT manquant ou invalide." })
  findAll(): Observable<any[]> {
    return this.buildingClient.send(BuildingMessages.FIND_ALL_BUILDINGS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  @ApiOperation({ summary: "Récupérer un bâtiment par son ID" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID unique du bâtiment",
    example: 1,
  })
  @ApiOkResponse({ type: BuildingResponseDto, description: "Bâtiment trouvé." })
  @ApiResponse({ status: 401, description: "Authentification requise." })
  @ApiResponse({ status: 404, description: "Bâtiment introuvable." })
  findOne(@Param("id") id: number): Observable<any> {
    return this.buildingClient.send(
      BuildingMessages.FIND_ONE_BUILDING,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  @ApiOperation({ summary: "[ADMIN] Créer un nouveau bâtiment" })
  @ApiBody({ type: CreateBuildingDto })
  @ApiResponse({
    status: 201,
    type: BuildingResponseDto,
    description: "Le bâtiment a été créé avec succès.",
  })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  create(@Body() building: CreateBuildingDto): Observable<Building> {
    return this.buildingClient.send(BuildingMessages.CREATE_BUILDING, building);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("/:id")
  @ApiOperation({
    summary: "[ADMIN] Mettre à jour les informations d'un bâtiment",
  })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID du bâtiment à modifier",
    example: 1,
  })
  @ApiBody({ type: UpdateBuildingDto })
  @ApiOkResponse({
    type: BuildingResponseDto,
    description: "Le bâtiment a été modifié.",
  })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  update(
    @Param("id") id: number,
    @Body() building: UpdateBuildingDto,
  ): Observable<Building> {
    return this.buildingClient.send(BuildingMessages.UPDATE_BUILDING, {
      ...building,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  @ApiOperation({ summary: "[ADMIN] Supprimer un bâtiment" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID du bâtiment à supprimer définitivement",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Le bâtiment a été supprimé." })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  delete(@Param("id") id: number): Observable<void> {
    return this.buildingClient.send(
      BuildingMessages.DELETE_BUILDING,
      Number(id),
    );
  }
}
