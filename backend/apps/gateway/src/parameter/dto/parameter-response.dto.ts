import { ApiProperty } from '@nestjs/swagger'

export class ParameterResponseDto {
	@ApiProperty({ example: 1, description: "L'identifiant unique du paramètre" })
	id: number

	@ApiProperty({
		example: 'maintenance_mode',
		description: 'Le nom de la clé de configuration',
	})
	name: string

	@ApiProperty({
		example: 'off',
		description: 'La valeur affectée à la configuration (format texte ou JSON)',
	})
	value: string

	@ApiProperty({
		example: 1,
		description: "L'ID de l'utilisateur lié à ce paramètre spécifique",
		nullable: true,
	})
	userId: number
}
