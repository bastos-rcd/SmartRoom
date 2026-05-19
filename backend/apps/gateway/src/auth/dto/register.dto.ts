import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    example: "Antoine",
    description: "Le prénom de l'utilisateur",
  })
  firstName: string;

  @ApiProperty({
    example: "Dupont",
    description: "Le nom de l'utilisateur",
  })
  lastName: string;

  @ApiProperty({
    example: "antoine.dupont@gmail.com",
    description: "L'adresse email de l'utilisateur",
  })
  email: string;

  @ApiProperty({
    example: "superpassword123",
    description: "Le mot de passe en clair",
  })
  password: string;
}
