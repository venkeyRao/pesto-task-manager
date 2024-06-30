import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { TaskStatus } from "@prisma/client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { NotFoundException } from "@nestjs/common";

describe("TaskController", () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        MongoPrismaService,
        {
          provide: AccessTokenGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const result = {
        data: [],
        meta: {
          total: 0,
        },
      };
      jest.spyOn(service, "findAll").mockResolvedValue(result);

      expect(await controller.findAll({ skip: 0, take: 10, status: TaskStatus.TO_DO })).toBe(result);
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
      jest.spyOn(service, "findOne").mockResolvedValue(result);

      expect(await controller.findOne("1")).toBe(result);
    });

    it("should throw a NotFoundException", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(null);

      await expect(controller.findOne("1")).rejects.toThrow(NotFoundException);
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
      jest.spyOn(service, "create").mockResolvedValue(result);

      expect(await controller.create(createTaskDto)).toBe(result);
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
      jest.spyOn(service, "update").mockResolvedValue(result);

      expect(await controller.update("1", updateTaskDto)).toBe(result);
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
      jest.spyOn(service, "delete").mockResolvedValue(result);

      expect(await controller.delete("1")).toBe(result);
    });
  });
});
