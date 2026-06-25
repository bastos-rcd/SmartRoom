import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateParameterDto {
	@ApiPropertyOptional({ example: 'maintenance_mode' })
	name?: string

	@ApiPropertyOptional({ example: 'on' })
	value?: string

	@ApiPropertyOptional({ example: 1 })
	userId?: number
}
