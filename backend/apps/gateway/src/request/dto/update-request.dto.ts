import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateRequestDto {
	@ApiPropertyOptional({ example: 'incident', enum: ['incident', 'request'] })
	type?: 'incident' | 'request'

	@ApiPropertyOptional({
		example: "Le projecteur ne s'allume plus du tout (voyant rouge)",
	})
	description?: string

	@ApiPropertyOptional({
		example: 0,
		enum: [0, 1],
		description: 'Permet de passer le ticket à 0 pour le clôturer',
	})
	status?: number

	@ApiPropertyOptional({ example: 1 })
	userId?: number
}
