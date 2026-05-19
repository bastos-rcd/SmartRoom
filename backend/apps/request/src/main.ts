import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { RequestModule } from "./request.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RequestModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: Number(process.env.REQUEST_SERVICE_PORT) || 3006,
      },
    },
  );
  await app.listen();
}
bootstrap();
