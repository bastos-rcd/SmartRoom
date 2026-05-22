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
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiOkResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger'

import { EQUIPMENT_SERVICE, EquipmentMessages } from '@app/shared'
import { Equipment } from 'apps/equipment/src/equipment.entity'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { EquipmentResponseDto } from './dto/equipment-response.dto'

@ApiTags('Équipements')
@ApiBearerAuth('JWT-auth')
@Controller('equipments')
export class EquipmentController {
	constructor(
		@Inject(EQUIPMENT_SERVICE)
		private readonly equipmentClient: ClientProxy,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Get()
	@ApiOperation({ summary: 'Récupérer la liste de tous les équipements' })
	@ApiOkResponse({
		type: [EquipmentResponseDto],
		description: 'Liste des équipements récupérée avec succès.',
	})
	@ApiResponse({
		status: 401,
		description: 'Token JWT manquant, expiré ou invalide.',
	})
	findAll(): Observable<any[]> {
		return this.equipmentClient.send(EquipmentMessages.FIND_ALL_EQUIPMENTS, {})
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Get('/:id')
	@ApiOperation({ summary: "Récupérer les détails d'un équipement par son ID" })
	@ApiParam({
		name: 'id',
		type: 'number',
		description: "ID unique de l'équipement",
		example: 1,
	})
	@ApiOkResponse({
		type: EquipmentResponseDto,
		description: 'Équipement trouvé.',
	})
	@ApiResponse({ status: 401, description: 'Authentification requise.' })
	@ApiResponse({
		status: 404,
		description: "L'équipement demandé n'existe pas.",
	})
	findOne(@Param('id') id: number): Observable<any> {
		return this.equipmentClient.send(
			EquipmentMessages.FIND_ONE_EQUIPMENT,
			Number(id),
		)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@Post()
	@ApiOperation({ summary: '[ADMIN] Ajouter un nouvel équipement' })
	@ApiBody({ type: CreateEquipmentDto })
	@ApiResponse({
		status: 201,
		type: EquipmentResponseDto,
		description: "L'équipement a été ajouté avec succès.",
	})
	@ApiResponse({
		status: 403,
		description: 'Accès interdit (Rôle ADMIN requis).',
	})
	create(@Body() equipment: CreateEquipmentDto): Observable<Equipment> {
		return this.equipmentClient.send(
			EquipmentMessages.CREATE_EQUIPMENT,
			equipment,
		)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@Put('/:id')
	@ApiOperation({
		summary: "[ADMIN] Modifier les informations d'un équipement",
	})
	@ApiParam({
		name: 'id',
		type: 'number',
		description: "ID de l'équipement à modifier",
		example: 1,
	})
	@ApiBody({ type: UpdateEquipmentDto })
	@ApiOkResponse({
		type: EquipmentResponseDto,
		description: "L'équipement a été mis à jour avec succès.",
	})
	@ApiResponse({
		status: 403,
		description: 'Accès interdit (Rôle ADMIN requis).',
	})
	update(
		@Param('id') id: number,
		@Body() equipment: UpdateEquipmentDto,
	): Observable<Equipment> {
		return this.equipmentClient.send(EquipmentMessages.UPDATE_EQUIPMENT, {
			...equipment,
			id: Number(id),
		})
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN')
	@Delete('/:id')
	@ApiOperation({ summary: '[ADMIN] Supprimer définitivement un équipement' })
	@ApiParam({
		name: 'id',
		type: 'number',
		description: "ID de l'équipement à supprimer",
		example: 1,
	})
	@ApiResponse({ status: 200, description: "L'équipement a été supprimé." })
	@ApiResponse({
		status: 403,
		description: 'Accès interdit (Rôle ADMIN requis).',
	})
	delete(@Param('id') id: number): Observable<void> {
		return this.equipmentClient.send(
			EquipmentMessages.DELETE_EQUIPMENT,
			Number(id),
		)
	}
}
