import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { NotFoundException } from "@nestjs/common";
import { UserStatus } from "@prisma/client";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        MongoPrismaService,
        {
          provide: AccessTokenGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = {
        data: [],
        meta: {
          total: 0,
        },
      };
      jest.spyOn(service, "findAll").mockResolvedValue(result);

      expect(await controller.findAll({ skip: 0, take: 10, orderBy: "createdAt", filterDate: "" })).toBe(result);
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      const result = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, "findOne").mockResolvedValue(result);

      expect(await controller.findOne("1")).toBe(result);
    });
  });
});
