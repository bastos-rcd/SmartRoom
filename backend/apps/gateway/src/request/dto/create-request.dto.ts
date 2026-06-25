import { ApiProperty } from '@nestjs/swagger'

export class CreateRequestDto {
	@ApiProperty({
		example: 'incident',
		enum: ['incident', 'request'],
		description: 'Catégorie du ticket',
	})
	type: 'incident' | 'request'

	@ApiProperty({
		example: 'Le projecteur de la salle A101 ne fonctionne plus',
		description: "Détails de la demande ou de l'incident constaté",
	})
	description: string

	@ApiProperty({
		example: 1,
		enum: [0, 1],
		default: 1,
		description: 'Statut du ticket (0: Fermé, 1: Ouvert)',
	})
	status: number

	@ApiProperty({
		example: 1,
		description: "ID de l'utilisateur qui émet le ticket",
	})
	userId: number
}
