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

import { EQUIPMENT_SERVICE, EquipmentMessages } from "@app/shared";
import { Equipment } from "apps/equipment/src/equipment.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("equipments")
export class EquipmentController {
  constructor(
    @Inject(EQUIPMENT_SERVICE)
    private readonly equipmentClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.equipmentClient.send(EquipmentMessages.FIND_ALL_EQUIPMENTS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.equipmentClient.send(
      EquipmentMessages.FIND_ONE_EQUIPMENT,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() equipment: Equipment): Observable<Equipment> {
    return this.equipmentClient.send(
      EquipmentMessages.CREATE_EQUIPMENT,
      equipment,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() equipment: Equipment,
  ): Observable<Equipment> {
    return this.equipmentClient.send(EquipmentMessages.UPDATE_EQUIPMENT, {
      ...equipment,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.equipmentClient.send(
      EquipmentMessages.DELETE_EQUIPMENT,
      Number(id),
    );
  }
}
