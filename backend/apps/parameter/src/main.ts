import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { ParameterModule } from "./parameter.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ParameterModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: Number(process.env.PARAMETER_SERVICE_PORT) || 3004,
      },
    },
  );
  await app.listen();
}
bootstrap();
