import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { BuildingModule } from "./building.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BuildingModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: Number(process.env.BUILDING_SERVICE_PORT) || 3002,
      },
    },
  );
  await app.listen();
}
bootstrap();
