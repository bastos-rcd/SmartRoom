import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
	@ApiProperty({
		example: 1,
		description: "L'identifiant unique de l'utilisateur",
	})
	id: number

	@ApiProperty({ example: 'John', description: 'Le prénom' })
	firstName: string

	@ApiProperty({ example: 'Doe', description: 'Le nom de famille' })
	lastName: string

	@ApiProperty({
		example: 'john.doe@example.com',
		description: "L'adresse email unique",
	})
	email: string

	@ApiProperty({
		example: 'admin',
		enum: ['admin', 'user'],
		description: "Le rôle de l'utilisateur",
	})
	role: string

	@ApiProperty({
		example: 1,
		enum: [0, 1],
		description: 'Le statut du compte (0: inactif, 1: actif)',
	})
	status: number
}
