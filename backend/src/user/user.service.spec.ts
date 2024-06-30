import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserStatus } from "@prisma/client";

describe("UserService", () => {
  let service: UserService;
  let prismaService: MongoPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MongoPrismaService,
          useValue: {
            user: {
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

    service = module.get<UserService>(UserService);
    prismaService = module.get<MongoPrismaService>(MongoPrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return a paginated result of users", async () => {
      const result = {
        data: [
          {
            id: "1",
            email: "venki@gmail.com",
            name: "venki Rao",
            password: "hashPass",
            status: UserStatus.ACTIVE,
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
        },
      };
      jest.spyOn(prismaService.user, "findMany").mockResolvedValue(result.data);
      jest.spyOn(prismaService.user, "count").mockResolvedValue(result.meta.total);

      expect(await service.findAll({ skip: 0, take: 10 })).toEqual(result);
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      const result = {
        id: "1",
        email: "venki@gmail.com",
        name: "venki Rao",
        password: "hashPass",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const resultWithoutPass = {
        id: "1",
        email: "venki@gmail.com",
        name: "venki Rao",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, "findUnique").mockResolvedValue(result);

      expect(await service.findOne("1")).toStrictEqual(resultWithoutPass);
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      const createUserDto: CreateUserDto = { email: "venki@gmail.com", password: "ADmin!23", name: "venki" };
      const result = {
        id: "1",
        email: "venki@gmail.com",
        name: null,
        password: "hashPass",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, "create").mockResolvedValue(result);

      expect(await service.create(createUserDto)).toBe(result);
    });
  });
});
