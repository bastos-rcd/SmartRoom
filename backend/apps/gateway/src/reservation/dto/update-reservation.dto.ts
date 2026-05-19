import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateReservationDto {
  @ApiPropertyOptional({ example: "2026-05-19T14:00:00.000Z" })
  startDate?: Date;

  @ApiPropertyOptional({ example: "2026-05-19T16:00:00.000Z" })
  endDate?: Date;

  @ApiPropertyOptional({
    example: "modified",
    enum: ["confirmed", "cancelled", "modified"],
  })
  status?: "confirmed" | "cancelled" | "modified";

  @ApiPropertyOptional({ example: "Horaire décalé suite à un imprévu" })
  comment?: string;

  @ApiPropertyOptional({ example: 1 })
  userId?: number;

  @ApiPropertyOptional({ example: 2 })
  roomId?: number;
}
