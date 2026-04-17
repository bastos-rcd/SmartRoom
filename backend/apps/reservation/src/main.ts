import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { ReservationModule } from "./reservation.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReservationModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: Number(process.env.RESERVATION_SERVICE_PORT) || 3002,
      },
    },
  );
  await app.listen();
}
bootstrap();
