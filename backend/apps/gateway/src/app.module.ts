import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ReservationModule } from "./reservation/reservation.module";
import { RequestModule } from "./request/request.module";
import { ParameterModule } from "./parameter/parameter.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ReservationModule,
    RequestModule,
    ParameterModule,
  ],
})
export class AppModule {}
