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
            title: "Test Task",
            description: "Test Description",
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
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(result);

      expect(await service.findOne("1")).toBe(result);
    });

    it("should throw a NotFoundException", async () => {
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create and return a new task", async () => {
      const createTaskDto: CreateTaskDto = { title: "New Task" };
      const result = {
        id: "1",
        title: "New Task",
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
      const updateTaskDto: UpdateTaskDto = { title: "Updated Task" };
      const result = {
        id: "1",
        title: "Updated Task",
        description: "Updated Description",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "update").mockResolvedValue(result);

      expect(await service.update("1", updateTaskDto)).toBe(result);
    });

    it("should throw a NotFoundException", async () => {
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(null);

      await expect(service.update("1", { title: "Updated Task" })).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete and return the deleted task", async () => {
      const result = {
        id: "1",
        title: "Deleted Task",
        description: "Deleted Description",
        status: TaskStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.task, "delete").mockResolvedValue(result);

      expect(await service.delete("1")).toBe(result);
    });

    it("should throw a NotFoundException", async () => {
      jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(NotFoundException);
    });
  });
});
