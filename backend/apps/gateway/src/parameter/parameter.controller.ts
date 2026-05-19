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

import { PARAMETER_SERVICE, ParameterMessages } from "@app/shared";
import { Parameter } from "apps/parameter/src/parameter.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

import { CreateParameterDto } from "./dto/create-parameter.dto";
import { UpdateParameterDto } from "./dto/update-parameter.dto";
import { ParameterResponseDto } from "./dto/parameter-response.dto";

@ApiTags("Paramètres de Configuration")
@ApiBearerAuth("JWT-auth")
@Controller("parameters")
export class ParameterController {
  constructor(
    @Inject(PARAMETER_SERVICE)
    private readonly parameterClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  @ApiOperation({ summary: "Récupérer la liste de tous les paramètres" })
  @ApiOkResponse({
    type: [ParameterResponseDto],
    description: "Liste des configurations récupérée avec succès.",
  })
  @ApiResponse({
    status: 401,
    description: "Authentification requise (Token manquant ou expiré).",
  })
  findAll(): Observable<any[]> {
    return this.parameterClient.send(ParameterMessages.FIND_ALL_PARAMETERS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  @ApiOperation({ summary: "Récupérer un paramètre spécifique par son ID" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID unique du paramètre",
    example: 1,
  })
  @ApiOkResponse({
    type: ParameterResponseDto,
    description: "Paramètre trouvé.",
  })
  @ApiResponse({
    status: 404,
    description: "Le paramètre demandé n'existe pas.",
  })
  findOne(@Param("id") id: number): Observable<any> {
    return this.parameterClient.send(
      ParameterMessages.FIND_ONE_PARAMETER,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  @ApiOperation({ summary: "Créer un nouveau paramètre de configuration" })
  @ApiBody({ type: CreateParameterDto })
  @ApiResponse({
    status: 201,
    type: ParameterResponseDto,
    description: "Le paramètre a été enregistré avec succès.",
  })
  create(@Body() parameter: CreateParameterDto): Observable<Parameter> {
    return this.parameterClient.send(
      ParameterMessages.CREATE_PARAMETER,
      parameter,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  @ApiOperation({
    summary: "Mettre à jour la valeur d'un paramètre de configuration",
  })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID du paramètre à modifier",
    example: 1,
  })
  @ApiBody({ type: UpdateParameterDto })
  @ApiOkResponse({
    type: ParameterResponseDto,
    description: "Le paramètre a été modifié avec succès.",
  })
  update(
    @Param("id") id: number,
    @Body() parameter: UpdateParameterDto,
  ): Observable<Parameter> {
    return this.parameterClient.send(ParameterMessages.UPDATE_PARAMETER, {
      ...parameter,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  @ApiOperation({ summary: "Supprimer un paramètre de configuration" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID du paramètre à supprimer",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Le paramètre a été supprimé de la base de données.",
  })
  delete(@Param("id") id: number): Observable<void> {
    return this.parameterClient.send(
      ParameterMessages.DELETE_PARAMETER,
      Number(id),
    );
  }
}
