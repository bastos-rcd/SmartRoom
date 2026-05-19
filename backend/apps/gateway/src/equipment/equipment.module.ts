import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { EQUIPMENT_SERVICE } from "@app/shared";

import { EquipmentController } from "./equipment.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EQUIPMENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.EQUIPMENT_SERVICE_HOST || "localhost",
          port: Number(process.env.EQUIPMENT_SERVICE_PORT) || 3004,
        },
      },
    ]),
  ],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
