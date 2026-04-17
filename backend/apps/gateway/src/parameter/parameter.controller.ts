import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { PARAMETER_SERVICE, ParameterMessages } from "@app/shared";
import { Parameter } from "apps/parameter/src/parameter.entity";

@Controller("parameters")
export class ParameterController {
  constructor(
    @Inject(PARAMETER_SERVICE)
    private readonly parameterClient: ClientProxy,
  ) {}

  @Get()
  findAll(): Observable<any[]> {
    return this.parameterClient.send(ParameterMessages.FIND_ALL_PARAMETERS, {});
  }

  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.parameterClient.send(
      ParameterMessages.FIND_ONE_PARAMETER,
      Number(id),
    );
  }

  @Post("create")
  create(@Body() parameter: Parameter): Observable<Parameter> {
    return this.parameterClient.send(
      ParameterMessages.CREATE_PARAMETER,
      parameter,
    );
  }

  @Put("update/:id")
  update(
    @Param("id") id: number,
    @Body() parameter: Parameter,
  ): Observable<Parameter> {
    return this.parameterClient.send(ParameterMessages.UPDATE_PARAMETER, {
      ...parameter,
      id: Number(id),
    });
  }

  @Delete("delete/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.parameterClient.send(
      ParameterMessages.DELETE_PARAMETER,
      Number(id),
    );
  }
}
