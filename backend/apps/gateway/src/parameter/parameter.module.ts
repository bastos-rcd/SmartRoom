import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { PARAMETER_SERVICE } from "@app/shared";

import { ParameterController } from "./parameter.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PARAMETER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.PARAMETER_SERVICE_HOST || "localhost",
          port: Number(process.env.PARAMETER_SERVICE_PORT) || 3007,
        },
      },
    ]),
  ],
  controllers: [ParameterController],
})
export class ParameterModule {}
