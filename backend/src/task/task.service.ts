import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { TaskStatus } from "@prisma/client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginateFunction, paginator } from "../common/interfaces/paginate.interface";

const paginate: PaginateFunction = paginator({ skip: 0, take: 10 });

@Injectable()
export class TaskService {
  constructor(private readonly mongoPrismaService: MongoPrismaService) {}

  async findAll(params: { skip?: number; take?: number; status?: TaskStatus }) {
    const { skip, take, status } = params;

    if (status) {
      return await paginate(
        this.mongoPrismaService.task,
        {
          where: {
            status,
          },
        },
        {
          skip,
          take,
        },
      );
    }

    return await paginate(this.mongoPrismaService.task, {
      skip,
      take,
    });
  }

  async findOne(id: string) {
    return await this.mongoPrismaService.task.findUnique({
      where: {
        id,
      },
    });
  }

  async create(taskDetails: CreateTaskDto) {
    return await this.mongoPrismaService.task.create({ data: taskDetails });
  }

  async update(id: string, taskDetails: UpdateTaskDto) {
    const task = await this.mongoPrismaService.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) throw new NotFoundException("Task Not Found!");

    return await this.mongoPrismaService.task.update({
      where: {
        id,
      },
      data: taskDetails,
    });
  }

  async delete(id: string) {
    return await this.mongoPrismaService.task.delete({
      where: {
        id,
      },
    });
  }
}
