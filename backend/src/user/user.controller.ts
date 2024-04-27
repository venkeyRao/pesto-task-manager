import { Controller, Get, Param, UseGuards, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";

@Controller("v1/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() query: { skip: number; take: number; orderBy: string; filterDate: string }) {
    return this.userService.findAll({
      skip: Number(query.skip),
      take: Number(query.take),
      orderBy: query.orderBy,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }
}
