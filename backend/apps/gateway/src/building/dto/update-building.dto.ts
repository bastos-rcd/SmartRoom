import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateBuildingDto {
  @ApiPropertyOptional({ example: "Bâtiment Principal" })
  name?: string;

  @ApiPropertyOptional({ example: "28 Avenue du BG, 31100 Toulouse, France" })
  address?: string;

  @ApiPropertyOptional({ example: 4 })
  nbFloors?: number;
}
