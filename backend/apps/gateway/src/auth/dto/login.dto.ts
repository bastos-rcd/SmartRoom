import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({
		example: 'antoine.dupont@gmail.com',
		description: "L'adresse email de l'utilisateur",
	})
	email: string

	@ApiProperty({
		example: 'superpassword123',
		description: 'Le mot de passe en clair',
	})
	password: string
}
