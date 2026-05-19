import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ReservationModule } from "./reservation/reservation.module";
import { RequestModule } from "./request/request.module";
import { ParameterModule } from "./parameter/parameter.module";
import { BuildingModule } from "apps/building/src/building.module";
import { RoomModule } from "apps/room/src/room.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ReservationModule,
    RequestModule,
    ParameterModule,
    BuildingModule,
    RoomModule,
  ],
})
export class AppModule {}
