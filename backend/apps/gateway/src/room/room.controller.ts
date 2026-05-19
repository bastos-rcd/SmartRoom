import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { ROOM_SERVICE, RoomMessages } from "@app/shared";
import { Room } from "apps/room/src/room.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("rooms")
export class RoomController {
  constructor(
    @Inject(ROOM_SERVICE)
    private readonly roomClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.roomClient.send(RoomMessages.FIND_ALL_ROOMS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.roomClient.send(RoomMessages.FIND_ONE_ROOM, Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() room: Room): Observable<Room> {
    return this.roomClient.send(RoomMessages.CREATE_ROOM, room);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("/:id")
  update(@Param("id") id: number, @Body() room: Room): Observable<Room> {
    return this.roomClient.send(RoomMessages.UPDATE_ROOM, {
      ...room,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.roomClient.send(RoomMessages.DELETE_ROOM, Number(id));
  }
}
