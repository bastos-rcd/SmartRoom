import { ApiProperty } from "@nestjs/swagger";

export class CreateParameterDto {
  @ApiProperty({
    example: "maintenance_mode",
    description: "Le nom de la clé unique du paramètre",
  })
  name: string;

  @ApiProperty({
    example: "off",
    description: "La valeur du paramètre sous forme de texte",
  })
  value: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: "ID de l'utilisateur associé (facultatif)",
  })
  userId?: number;
}
