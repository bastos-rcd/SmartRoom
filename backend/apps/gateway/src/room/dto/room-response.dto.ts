import { ApiProperty } from "@nestjs/swagger";

export class RoomResponseDto {
  @ApiProperty({ example: 1, description: "L'identifiant unique de la salle" })
  id: number;

  @ApiProperty({ example: "A101", description: "Le nom ou numéro de la salle" })
  name: string;

  @ApiProperty({ example: 30, description: "La capacité maximale d’accueil" })
  capacity: number;

  @ApiProperty({ example: 2, description: "L’étage où se situe la salle" })
  floor: number;

  @ApiProperty({
    example: 1,
    enum: [0, 1],
    description: "L’état de la salle (0: indisponible, 1: disponible)",
  })
  state: number;

  @ApiProperty({
    example: "Aile nord",
    description: "Une précision sur la localisation dans le bâtiment",
    nullable: true,
  })
  location: string;

  @ApiProperty({
    example: 1,
    description: "L'ID du bâtiment auquel appartient cette salle",
  })
  buildingId: number;
}
