import { ApiProperty } from "@nestjs/swagger";

export class ReservationResponseDto {
  @ApiProperty({ example: 1, description: "L'identifiant de la réservation" })
  id: number;

  @ApiProperty({
    example: "2026-05-19T10:00:00.000Z",
    description: "Date et heure de début (Format ISO)",
  })
  startDate: Date;

  @ApiProperty({
    example: "2026-05-19T12:00:00.000Z",
    description: "Date et heure de fin (Format ISO)",
  })
  endDate: Date;

  @ApiProperty({
    example: "confirmed",
    enum: ["confirmed", "cancelled", "modified"],
    description: "Statut de la réservation",
  })
  status: "confirmed" | "cancelled" | "modified";

  @ApiProperty({
    example: "Réunion d’équipe hebdomadaire",
    description: "Commentaire ou motif",
    nullable: true,
  })
  comment: string;

  @ApiProperty({ example: 1, description: "L'ID de l'utilisateur qui réserve" })
  userId: number;

  @ApiProperty({ example: 2, description: "L'ID de la salle réservée" })
  roomId: number;
}
