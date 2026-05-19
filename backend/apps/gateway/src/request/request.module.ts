import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { REQUEST_SERVICE } from "@app/shared";

import { RequestController } from "./request.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: REQUEST_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.REQUEST_SERVICE_HOST || "localhost",
          port: Number(process.env.REQUEST_SERVICE_PORT) || 3006,
        },
      },
    ]),
  ],
  controllers: [RequestController],
})
export class RequestModule {}
