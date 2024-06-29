import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, MongoPrismaService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
