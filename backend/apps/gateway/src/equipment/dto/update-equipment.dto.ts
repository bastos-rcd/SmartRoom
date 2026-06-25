import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateEquipmentDto {
	@ApiPropertyOptional({ example: 'Vidéo-projecteur 4K' })
	name?: string

	@ApiPropertyOptional({ example: 'informatique' })
	type?: string

	@ApiPropertyOptional({ example: 0, enum: [0, 1] })
	available?: number

	@ApiPropertyOptional({
		example: 2,
		description: 'Permet de déplacer un équipement dans une autre salle',
	})
	roomId?: number
}
