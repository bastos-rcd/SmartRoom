import { ApiProperty } from '@nestjs/swagger'

export class CreateReservationDto {
	@ApiProperty({
		example: '2026-05-19T10:00:00.000Z',
		description: 'Date de début de la réservation (ISO 8601)',
	})
	startDate: Date

	@ApiProperty({
		example: '2026-05-19T12:00:00.000Z',
		description: 'Date de fin de la réservation (ISO 8601)',
	})
	endDate: Date

	@ApiProperty({
		example: 'confirmed',
		enum: ['confirmed', 'cancelled', 'modified'],
		default: 'confirmed',
		description: 'Statut initial',
	})
	status: 'confirmed' | 'cancelled' | 'modified'

	@ApiProperty({
		example: 'Réunion d’équipe hebdomadaire',
		required: false,
		description: 'Notes complémentaires',
	})
	comment: string

	@ApiProperty({
		example: 1,
		description: "ID de l'utilisateur effectuant la réservation",
	})
	userId: number

	@ApiProperty({ example: 2, description: 'ID de la salle à louer' })
	roomId: number
}
