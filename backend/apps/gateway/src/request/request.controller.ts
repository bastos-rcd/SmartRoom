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

import { REQUEST_SERVICE, RequestMessages } from "@app/shared";
import { Request } from "apps/request/src/request.entity";

@Controller("requests")
export class RequestController {
  constructor(
    @Inject(REQUEST_SERVICE)
    private readonly requestClient: ClientProxy,
  ) {}

  @Get()
  findAll(): Observable<any[]> {
    return this.requestClient.send(RequestMessages.FIND_ALL_REQUESTS, {});
  }

  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.requestClient.send(
      RequestMessages.FIND_ONE_REQUEST,
      Number(id),
    );
  }

  @Post("create")
  create(@Body() request: Request): Observable<Request> {
    return this.requestClient.send(RequestMessages.CREATE_REQUEST, request);
  }

  @Put("update/:id")
  update(
    @Param("id") id: number,
    @Body() request: Request,
  ): Observable<Request> {
    return this.requestClient.send(RequestMessages.UPDATE_REQUEST, {
      ...request,
      id: Number(id),
    });
  }

  @Delete("delete/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.requestClient.send(RequestMessages.DELETE_REQUEST, Number(id));
  }
}
