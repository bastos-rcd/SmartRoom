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

import { PARAMETER_SERVICE, ParameterMessages } from "@app/shared";
import { Parameter } from "apps/parameter/src/parameter.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("parameters")
export class ParameterController {
  constructor(
    @Inject(PARAMETER_SERVICE)
    private readonly parameterClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.parameterClient.send(ParameterMessages.FIND_ALL_PARAMETERS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.parameterClient.send(
      ParameterMessages.FIND_ONE_PARAMETER,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  create(@Body() parameter: Parameter): Observable<Parameter> {
    return this.parameterClient.send(
      ParameterMessages.CREATE_PARAMETER,
      parameter,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() parameter: Parameter,
  ): Observable<Parameter> {
    return this.parameterClient.send(ParameterMessages.UPDATE_PARAMETER, {
      ...parameter,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.parameterClient.send(
      ParameterMessages.DELETE_PARAMETER,
      Number(id),
    );
  }
}
