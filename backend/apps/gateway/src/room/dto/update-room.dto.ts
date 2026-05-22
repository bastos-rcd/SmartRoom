import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateRoomDto {
	@ApiPropertyOptional({ example: 'A101' })
	name?: string

	@ApiPropertyOptional({ example: 25 })
	capacity?: number

	@ApiPropertyOptional({ example: 2 })
	floor?: string

	@ApiPropertyOptional({ example: 1, enum: [0, 1] })
	state?: number

	@ApiPropertyOptional({ example: 'Aile nord - Proche ascenseur' })
	location?: string

	@ApiPropertyOptional({ example: 1 })
	buildingId?: number
}
