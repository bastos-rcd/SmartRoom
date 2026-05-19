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

import { BUILDING_SERVICE, BuildingMessages } from "@app/shared";
import { Building } from "apps/building/src/building.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("buildings")
export class BuildingController {
  constructor(
    @Inject(BUILDING_SERVICE)
    private readonly buildingClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.buildingClient.send(BuildingMessages.FIND_ALL_BUILDINGS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.buildingClient.send(
      BuildingMessages.FIND_ONE_BUILDING,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  create(@Body() building: Building): Observable<Building> {
    return this.buildingClient.send(BuildingMessages.CREATE_BUILDING, building);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() building: Building,
  ): Observable<Building> {
    return this.buildingClient.send(BuildingMessages.UPDATE_BUILDING, {
      ...building,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.buildingClient.send(
      BuildingMessages.DELETE_BUILDING,
      Number(id),
    );
  }
}
