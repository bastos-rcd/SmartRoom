import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty({
		example: 'Antoine',
		description: "Le prénom de l'utilisateur",
	})
	firstName: string

	@ApiProperty({ example: 'Dupont', description: 'Le nom de famille' })
	lastName: string

	@ApiProperty({
		example: 'antoine@gmail.com',
		description: "L'adresse email (unique)",
	})
	email: string

	@ApiProperty({
		example: 'password123',
		description: 'Le mot de passe en clair',
	})
	password: string

	@ApiProperty({
		example: 'user',
		enum: ['admin', 'user'],
		default: 'user',
		description: "Le rôle d'accès",
	})
	role: 'admin' | 'user'

	@ApiProperty({
		example: 1,
		enum: [0, 1],
		default: 1,
		description: 'Le statut du compte (0: inactif, 1: actif)',
	})
	status: number
}
