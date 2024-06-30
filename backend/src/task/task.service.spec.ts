import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { TaskStatus } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

describe("TaskService", () => {
  let service: TaskService;
  let prismaService: MongoPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: MongoPrismaService,
          useValue: {
            task: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<MongoPrismaService>(MongoPrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return a paginated result of tasks", async () => {
      const result = {
        data: [
          {
            id: "1",
            title: "Task one",
            description: "Task one desc",
            status: TaskStatus.TO_DO,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
        },
      };
      jest.spyOn(prismaService.task, "findMany").mockResolvedValue(result.data);
      jest.spyOn(prismaService.task, "count").mockResolvedValue(result.meta.total);

      expect(await service.findAll({ skip: 0, take: 10 })).toEqual(result);
    });
  });

  describe("findOne", () => {
    it("should return a single task", async () => {
      const result = {
        id: "1",
        title: "Task1",
        description: "task desc",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(result);

      expect(await service.findOne("1")).toBe(result);
    });
  });

  describe("create", () => {
    it("should create and return a new task", async () => {
      const createTaskDto: CreateTaskDto = { title: "new task" };
      const result = {
        id: "1",
        title: "new task",
        description: null,
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "create").mockResolvedValue(result);

      expect(await service.create(createTaskDto)).toBe(result);
    });
  });

  describe("update", () => {
    it("should update and return the updated task", async () => {
      const updateTaskDto: UpdateTaskDto = { title: "updated tsk" };
      const existingTask = {
        id: "1",
        title: "existing tsk",
        description: "exsist desc",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedTask = {
        id: "1",
        title: "updated tsk",
        description: "updated desc",
        status: TaskStatus.TO_DO,
        createdAt: existingTask.createdAt,
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(existingTask);
      jest.spyOn(prismaService.task, "update").mockResolvedValue(updatedTask);

      expect(await service.update("1", updateTaskDto)).toBe(updatedTask);
    });

    it("should throw a NotFoundException", async () => {
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(null);

      await expect(service.update("1", { title: "updated tsk" })).rejects.toThrow(
        new NotFoundException("Task Not Found!"),
      );
    });
  });

  describe("delete", () => {
    it("should delete and return the deleted task", async () => {
      const result = {
        id: "1",
        title: "delet task",
        description: "delete desc",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "delete").mockResolvedValue(result);

      expect(await service.delete("1")).toBe(result);
    });
  });
});
