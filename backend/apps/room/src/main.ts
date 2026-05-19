import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { RoomModule } from "./room.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RoomModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: Number(process.env.ROOM_SERVICE_PORT) || 3006,
      },
    },
  );
  await app.listen();
}
bootstrap();
