import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { USER_SERVICE, UserMessages } from "@app/shared";
import { User } from "apps/user/src/user.entity";

@Controller("users")
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  @Get()
  findAll(): Observable<any[]> {
    return this.userClient.send(UserMessages.FIND_ALL_USERS, {});
  }

  @Get("/:id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.userClient.send(UserMessages.FIND_ONE_USER, Number(id));
  }

  @Post("create")
  create(@Body() user: User): Observable<User> {
    return this.userClient.send(UserMessages.CREATE_USER, user);
  }

  @Put("update/:id")
  update(@Param("id") id: number, @Body() user: User): Observable<User> {
    return this.userClient.send(UserMessages.UPDATE_USER, {
      ...user,
      id: Number(id),
    });
  }

  @Delete("delete/:id")
  delete(@Param("id") id: number): Observable<void> {
    return this.userClient.send(UserMessages.DELETE_USER, Number(id));
  }
}
