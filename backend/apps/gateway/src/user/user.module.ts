import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { USER_SERVICE } from "@app/shared";

import { UserController } from "./user.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || "localhost",
          port: Number(process.env.USER_SERVICE_PORT) || 3001,
        },
      },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}
