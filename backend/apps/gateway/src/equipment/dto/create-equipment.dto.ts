import { ApiProperty } from '@nestjs/swagger'

export class CreateEquipmentDto {
	@ApiProperty({
		example: 'Vidéo-projecteur',
		description: "Nom explicite de l'appareil",
	})
	name: string

	@ApiProperty({
		example: 'informatique',
		description: 'Catégorie du matériel informatique/mobilier',
	})
	type: string

	@ApiProperty({
		example: 1,
		enum: [0, 1],
		default: 1,
		description: 'État de marche initial (0: En panne, 1: Fonctionnel)',
	})
	available: number

	@ApiProperty({
		example: 1,
		description:
			"ID de la salle d'affectation (doit exister dans la table room)",
	})
	roomId: number
}
