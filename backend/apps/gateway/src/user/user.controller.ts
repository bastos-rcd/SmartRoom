import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { USER_SERVICE, UserMessages } from "@app/shared";

@Controller()
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  @Get("users")
  findAll(): Observable<any[]> {
    return this.userClient.send(UserMessages.FIND_ALL, {});
  }
}
