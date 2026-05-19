import { Controller } from "@nestjs/common";
import { BuildingService } from "./building.service";
import { BuildingMessages } from "@app/shared";

import { MessagePattern } from "@nestjs/microservices";
import { Building } from "./building.entity";

@Controller()
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @MessagePattern(BuildingMessages.FIND_ALL_BUILDINGS)
  async findAll(): Promise<Building[]> {
    return this.buildingService.findAll();
  }

  @MessagePattern(BuildingMessages.FIND_ONE_BUILDING)
  async findOne(id: number): Promise<Building> {
    return this.buildingService.findOne(id);
  }

  @MessagePattern(BuildingMessages.CREATE_BUILDING)
  async create(building: Building): Promise<Building> {
    return this.buildingService.create(building);
  }

  @MessagePattern(BuildingMessages.UPDATE_BUILDING)
  async update(building: Building): Promise<Building> {
    return this.buildingService.update(building);
  }

  @MessagePattern(BuildingMessages.DELETE_BUILDING)
  async delete(id: number): Promise<void> {
    return this.buildingService.delete(id);
  }
}
