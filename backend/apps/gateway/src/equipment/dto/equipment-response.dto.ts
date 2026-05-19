import { ApiProperty } from "@nestjs/swagger";

export class EquipmentResponseDto {
  @ApiProperty({
    example: 1,
    description: "L'identifiant unique de l'équipement",
  })
  id: number;

  @ApiProperty({
    example: "Vidéo-projecteur",
    description: "Le nom de l'équipement",
  })
  name: string;

  @ApiProperty({
    example: "informatique",
    description: "Le type de matériel (ex: informatique, fourniture)",
  })
  type: string;

  @ApiProperty({
    example: 1,
    enum: [0, 1],
    description: "Disponibilité du matériel (0: indisponible, 1: disponible)",
  })
  available: number;

  @ApiProperty({
    example: 1,
    description: "L'ID de la salle (room) où se trouve l'équipement",
    nullable: true,
  })
  roomId: number;
}
