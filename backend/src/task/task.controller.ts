import { Controller, Get, Body, Patch, Param, UseGuards, Post, Query, Delete } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { TaskStatus } from "@prisma/client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("v1/task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() query: { skip: number; take: number; status: TaskStatus }) {
    return this.taskService.findAll({
      skip: Number(query.skip),
      take: Number(query.take),
      status: query.status,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() taskDetails: CreateTaskDto) {
    return this.taskService.create(taskDetails);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() taskDetails: UpdateTaskDto) {
    return this.taskService.update(id, taskDetails);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.taskService.delete(id);
  }
}
