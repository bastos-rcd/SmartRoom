import { ApiProperty } from '@nestjs/swagger'

export class RequestResponseDto {
	@ApiProperty({ example: 1, description: "L'identifiant de la demande" })
	id: number

	@ApiProperty({
		example: 'incident',
		enum: ['incident', 'request'],
		description: 'Le type de ticket',
	})
	type: 'incident' | 'request'

	@ApiProperty({
		example: 'Le projecteur de la salle A101 ne fonctionne plus',
		description: 'Description détaillée du problème ou besoin',
	})
	description: string

	@ApiProperty({
		example: 1,
		enum: [0, 1],
		description: 'Le statut du ticket (0: résolu/fermé, 1: ouvert/en cours)',
	})
	status: number

	@ApiProperty({
		example: '2026-05-19T09:33:48.000Z',
		description: 'Date de création générée automatiquement',
	})
	creationDate: Date

	@ApiProperty({
		example: 1,
		description: "L'ID de l'utilisateur ayant ouvert le ticket",
	})
	userId: number
}
