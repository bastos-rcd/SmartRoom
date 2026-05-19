import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "John" })
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe" })
  lastName?: string;

  @ApiPropertyOptional({ example: "john.doe@gmail.com" })
  email?: string;

  @ApiPropertyOptional({ example: "newpassword123" })
  password?: string;

  @ApiPropertyOptional({ example: "user", enum: ["admin", "user"] })
  role?: "admin" | "user";

  @ApiPropertyOptional({ example: 1, enum: [0, 1] })
  status?: number;
}
