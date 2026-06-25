import { ApiProperty } from '@nestjs/swagger'

export class RegisterResponseDto {
	@ApiProperty({ example: 'John' })
	firstName: string

	@ApiProperty({ example: 'Doe' })
	lastName: string

	@ApiProperty({ example: '[EMAIL_ADDRESS]' })
	email: string

	@ApiProperty({ example: '********' })
	password: string

	@ApiProperty({ example: 'user' })
	role: string

	@ApiProperty({ example: 1 })
	status: number
}
