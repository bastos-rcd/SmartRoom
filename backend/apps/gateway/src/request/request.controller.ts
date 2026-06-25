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

import { REQUEST_SERVICE, RequestMessages } from '@app/shared'
import { Request } from 'apps/request/src/request.entity'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

import { CreateRequestDto } from './dto/create-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { RequestResponseDto } from './dto/request-response.dto'

@ApiTags('Demandes & Incidents')
@ApiBearerAuth('JWT-auth')
@Controller('requests')
export class RequestController {
	constructor(
		@Inject(REQUEST_SERVICE)
		private readonly requestClient: ClientProxy,
	) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Get()
	@ApiOperation({
		summary: 'Récupérer la liste de toutes les demandes et incidents',
	})
	@ApiOkResponse({
		type: [RequestResponseDto],
		description: 'Liste des tickets récupérée avec succès.',
	})
	@ApiResponse({
		status: 401,
		description: 'Authentification requise (Token manquant ou expiré).',
	})
	findAll(): Observable<any[]> {
		return this.requestClient.send(RequestMessages.FIND_ALL_REQUESTS, {})
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Get('/:id')
	@ApiOperation({ summary: "Récupérer les détails d'un ticket par son ID" })
	@ApiParam({
		name: 'id',
		type: 'number',
		description: 'ID unique du ticket',
		example: 1,
	})
	@ApiOkResponse({ type: RequestResponseDto, description: 'Ticket trouvé.' })
	@ApiResponse({ status: 404, description: "Le ticket demandé n'existe pas." })
	findOne(@Param('id') id: number): Observable<any> {
		return this.requestClient.send(RequestMessages.FIND_ONE_REQUEST, Number(id))
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Post()
	@ApiOperation({ summary: "Créer un nouveau ticket d'incident ou de demande" })
	@ApiBody({ type: CreateRequestDto })
	@ApiResponse({
		status: 201,
		type: RequestResponseDto,
		description: 'Le ticket a été créé avec succès.',
	})
	create(@Body() request: CreateRequestDto): Observable<Request> {
		return this.requestClient.send(RequestMessages.CREATE_REQUEST, request)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Put('/:id')
	@ApiOperation({
		summary: "Modifier les informations d'un ticket (ex: Clôture)",
	})
	@ApiParam({
		name: 'id',
		type: 'number',
		description: 'ID du ticket à mettre à jour',
		example: 1,
	})
	@ApiBody({ type: UpdateRequestDto })
	@ApiOkResponse({
		type: RequestResponseDto,
		description: 'Le ticket a été modifié.',
	})
	update(
		@Param('id') id: number,
		@Body() request: UpdateRequestDto,
	): Observable<Request> {
		return this.requestClient.send(RequestMessages.UPDATE_REQUEST, {
			...request,
			id: Number(id),
		})
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'USER')
	@Delete('/:id')
	@ApiOperation({ summary: 'Supprimer un ticket de la base de données' })
	@ApiParam({
		name: 'id',
		type: 'number',
		description: 'ID du ticket à supprimer',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'Le ticket a été supprimé avec succès.',
	})
	delete(@Param('id') id: number): Observable<boolean> {
		return this.requestClient.send(RequestMessages.DELETE_REQUEST, Number(id))
	}
}
