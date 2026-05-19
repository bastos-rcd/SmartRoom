import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { Room } from "./room.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "smartroomdb",
      entities: [Room],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
