import { ApiProperty } from '@nestjs/swagger'

export class BuildingResponseDto {
	@ApiProperty({ example: 1, description: "L'id unique du bâtiment" })
	id: number

	@ApiProperty({
		example: 'Bâtiment Main',
		description: 'Le nom de la structure',
	})
	name: string

	@ApiProperty({
		example: '28 Avenue du BG, 31100 Toulouse, France',
		description: "L'adresse physique",
	})
	address: string

	@ApiProperty({ example: 3, description: "Le nombre total d'étages" })
	nbFloors: number
}
