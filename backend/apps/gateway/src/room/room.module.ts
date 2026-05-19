import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ROOM_SERVICE } from "@app/shared";

import { RoomController } from "./room.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ROOM_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.ROOM_SERVICE_HOST || "localhost",
          port: Number(process.env.ROOM_SERVICE_PORT) || 3006,
        },
      },
    ]),
  ],
  controllers: [RoomController],
})
export class ReservationModule {}
