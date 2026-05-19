import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { USER_SERVICE, UserMessages } from "@app/shared";
import { User } from "apps/user/src/user.entity";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthService } from "../auth/auth.service";

@Controller("users")
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  register(@Body() user: User): Observable<User> {
    return this.userClient.send(UserMessages.CREATE_USER, user);
  }

  @Post("login")
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll(): Observable<any[]> {
    return this.userClient.send(UserMessages.FIND_ALL_USERS, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Get(":id")
  findOne(@Param("id") id: number): Observable<any> {
    return this.userClient.send(UserMessages.FIND_ONE_USER, Number(id));
  }

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userClient.send(UserMessages.CREATE_USER, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Put("/:id")
  update(@Param("id") id: number, @Body() user: User): Observable<User> {
    return this.userClient.send(UserMessages.UPDATE_USER, {
      ...user,
      id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  delete(@Param("id") id: number): Observable<void> {
    console.log(id);
    return this.userClient.send(UserMessages.DELETE_USER, Number(id));
  }
}
