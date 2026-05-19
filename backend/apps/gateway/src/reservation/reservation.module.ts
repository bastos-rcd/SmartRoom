import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { RESERVATION_SERVICE } from "@app/shared";

import { ReservationController } from "./reservation.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RESERVATION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.RESERVATION_SERVICE_HOST || "localhost",
          port: Number(process.env.RESERVATION_SERVICE_PORT) || 3005,
        },
      },
    ]),
  ],
  controllers: [ReservationController],
})
export class ReservationModule {}
