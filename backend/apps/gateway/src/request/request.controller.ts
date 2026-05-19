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

import { REQUEST_SERVICE, RequestMessages } from "@app/shared";
import { Request } from "apps/request/src/request.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("requests")
export class RequestController {
  constructor(
    @Inject(REQUEST_SERVICE)
    private readonly requestClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get()
  findAll(): Observable<any[]> {
    return this.requestClient.send(RequestMessages.FIND_ALL_REQUESTS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.requestClient.send(
      RequestMessages.FIND_ONE_REQUEST,
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Post()
  create(@Body() request: Request): Observable<Request> {
    return this.requestClient.send(RequestMessages.CREATE_REQUEST, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() request: Request,
  ): Observable<Request> {
    return this.requestClient.send(RequestMessages.UPDATE_REQUEST, {
      ...request,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "USER")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.requestClient.send(RequestMessages.DELETE_REQUEST, Number(id));
  }
}
