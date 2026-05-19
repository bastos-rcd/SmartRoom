import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ParameterMessages } from "@app/shared";

import { ParameterService } from "./parameter.service";
import { Parameter } from "./parameter.entity";

@Controller()
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @MessagePattern(ParameterMessages.FIND_ALL_PARAMETERS)
  async findAll(): Promise<Parameter[]> {
    return this.parameterService.findAll();
  }

  @MessagePattern(ParameterMessages.FIND_ONE_PARAMETER)
  async findOne(id: number): Promise<Parameter> {
    return this.parameterService.findOne(id);
  }

  @MessagePattern(ParameterMessages.CREATE_PARAMETER)
  async create(parameter: Parameter): Promise<Parameter> {
    return this.parameterService.create(parameter);
  }

  @MessagePattern(ParameterMessages.UPDATE_PARAMETER)
  async update(parameter: Parameter): Promise<Parameter> {
    return this.parameterService.update(parameter);
  }

  @MessagePattern(ParameterMessages.DELETE_PARAMETER)
  async delete(id: number): Promise<void> {
    return this.parameterService.delete(id);
  }
}
