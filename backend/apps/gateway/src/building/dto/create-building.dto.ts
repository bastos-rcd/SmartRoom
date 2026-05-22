import { ApiProperty } from '@nestjs/swagger'

export class CreateBuildingDto {
	@ApiProperty({ example: 'Bâtiment Main', description: 'Le nom du bâtiment' })
	name: string

	@ApiProperty({
		example: '28 Avenue du BG, 31100 Toulouse, France',
		description: "L'adresse postale",
	})
	address: string

	@ApiProperty({
		example: 3,
		description: "Le nombre d'étages (doit être supérieur à 0)",
	})
	nbFloors: number
}
