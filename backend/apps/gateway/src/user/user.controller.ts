import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { USER_SERVICE, UserMessages } from "@app/shared";
import { User } from "apps/user/src/user.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserResponseDto } from "./dto/users-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("Utilisateurs")
@Controller("users")
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  @ApiOperation({
    summary: "[ADMIN] Récupérer la liste de tous les utilisateurs",
    description:
      "Cette route nécessite un token JWT valide possédant le rôle ADMIN.",
  })
  @ApiOkResponse({
    type: [UserResponseDto],
    description: "La liste des utilisateurs a été récupérée avec succès.",
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentification échouée (Token manquant, expiré ou invalide).",
  })
  @ApiResponse({
    status: 403,
    description:
      "Accès interdit. Seuls les utilisateurs avec le rôle ADMIN peuvent appeler cette route.",
  })
  findAll(): Observable<any[]> {
    return this.userClient.send(UserMessages.FIND_ALL_USERS, {});
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Get(":id")
  @ApiOperation({ summary: "Récupérer un utilisateur par son ID" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID unique de l'utilisateur en BDD",
    example: 1,
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: "L'utilisateur a été trouvé.",
  })
  @ApiResponse({ status: 401, description: "Token JWT manquant ou invalide." })
  @ApiResponse({ status: 403, description: "Accès refusé." })
  @ApiResponse({ status: 404, description: "Utilisateur introuvable." })
  findOne(@Param("id") id: number): Observable<any> {
    return this.userClient.send(UserMessages.FIND_ONE_USER, Number(id));
  }

  @Post()
  @ApiOperation({ summary: "Créer un nouvel utilisateur (Inscription)" })
  @ApiBody({
    type: CreateUserDto,
    description: "Données nécessaires pour créer un compte",
  })
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
    description: "L'utilisateur a été créé avec succès.",
  })
  @ApiResponse({
    status: 400,
    description: "Erreur dans les données fournies (ex: email déjà existant).",
  })
  create(@Body() user: CreateUserDto): Observable<User> {
    return this.userClient.send(UserMessages.CREATE_USER, user);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Put("/:id")
  @ApiOperation({ summary: "Mettre à jour les informations d'un utilisateur" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de l'utilisateur à modifier",
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: "Champs optionnels à mettre à jour",
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: "L'utilisateur a été mis à jour avec succès.",
  })
  @ApiResponse({ status: 401, description: "Authentification requise." })
  @ApiResponse({ status: 403, description: "Droits insuffisants." })
  update(
    @Param("id") id: number,
    @Body() user: UpdateUserDto,
  ): Observable<User> {
    return this.userClient.send(UserMessages.UPDATE_USER, {
      ...user,
      id: Number(id),
    });
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  @ApiOperation({ summary: "[ADMIN] Supprimer un utilisateur" })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID de l'utilisateur à supprimer définitivement",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "L'utilisateur a été supprimé avec succès.",
  })
  @ApiResponse({ status: 401, description: "Authentification requise." })
  @ApiResponse({
    status: 403,
    description: "Accès interdit (Rôle ADMIN requis).",
  })
  delete(@Param("id") id: number): Observable<void> {
    console.log(id);
    return this.userClient.send(UserMessages.DELETE_USER, Number(id));
  }
}
