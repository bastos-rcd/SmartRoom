import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {
  @ApiProperty({ example: "A101", description: "Nom de la salle" })
  name: string;

  @ApiProperty({ example: 30, description: "Nombre de places assises" })
  capacity: number;

  @ApiProperty({ example: 2, description: "Étage de la salle" })
  floor: number;

  @ApiProperty({
    example: 1,
    enum: [0, 1],
    default: 1,
    description: "Disponibilité initiale (0: Hors service, 1: Opérationnelle)",
  })
  state: number;

  @ApiProperty({
    example: "Aile nord",
    required: false,
    description: "Détails complémentaires d'emplacement",
  })
  location: string;

  @ApiProperty({
    example: 1,
    description: "ID d'un bâtiment existant dans la table building",
  })
  buildingId: number;
}
