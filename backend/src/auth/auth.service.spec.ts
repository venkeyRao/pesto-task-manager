import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotFoundException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { TokenType, UserStatus } from "@prisma/client";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let userService: UserService;
  let tokenService: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let mongoPrismaService: MongoPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        TokenService,
        JwtService,
        RefreshTokenStrategy,
        AccessTokenStrategy,
        MongoPrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    mongoPrismaService = module.get<MongoPrismaService>(MongoPrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("should return tokens and user details for valid credentials", async () => {
      const email = "venki@gmail.com";
      const password = "password";
      const user = {
        id: "123",
        email,
        name: "Venki Rao",
        password: await bcrypt.hash(password, 10),
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, "findByEmail").mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => true);
      jest
        .spyOn(service, "createTokens")
        .mockResolvedValue({ accessToken: "access_token", refreshToken: "refresh_token" });

      const result = await service.login({ email, password });
      expect(result).toEqual({
        user: { id: user.id, name: user.name, status: user.status },
        tokens: { accessToken: "access_token", refreshToken: "refresh_token" },
      });
    });

    it("should throw NotFoundException for invalid email", async () => {
      const email = "venki@gmail.com";
      const password = "password";
      jest.spyOn(userService, "findByEmail").mockResolvedValue(null);

      await expect(service.login({ email, password })).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException for invalid password", async () => {
      const email = "venki@gmail.com";
      const password = "password";
      const user = {
        id: "123",
        email,
        name: "Venki Rao",
        password: await bcrypt.hash("wrong_password", 10),
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, "findByEmail").mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => false);

      await expect(service.login({ email, password })).rejects.toThrow(ForbiddenException);
    });
  });

  describe("signup", () => {
    it("should create a new user and return tokens", async () => {
      const signupData = {
        email: "venki@gmail.com",
        password: "password",
        passwordConfirmation: "password",
        name: "Venki Rao",
      };
      const user = {
        id: "123",
        email: signupData.email,
        name: signupData.name,
        password: await bcrypt.hash(signupData.password, 10),
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
      jest.spyOn(userService, "create").mockResolvedValue(user);
      jest
        .spyOn(service, "createTokens")
        .mockResolvedValue({ accessToken: "access_token", refreshToken: "refresh_token" });

      const result = await service.signup(signupData);
      expect(result).toEqual({
        user: { id: user.id, name: user.name, status: user.status },
        tokens: { accessToken: "access_token", refreshToken: "refresh_token" },
      });
    });

    it("should throw ForbiddenException if user already exists", async () => {
      const signupData = {
        email: "venki@gmail.com",
        password: "password",
        passwordConfirmation: "password",
        name: "Venki Rao",
      };
      const user = {
        id: "123",
        email: signupData.email,
        name: signupData.name,
        password: await bcrypt.hash(signupData.password, 10),
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, "findByEmail").mockResolvedValue(user);

      await expect(service.signup(signupData)).rejects.toThrow(ForbiddenException);
    });
  });

  describe("refreshToken", () => {
    it("should refresh tokens for a valid request", async () => {
      const req = { user: { sub: "123", refreshToken: "refresh_token" } } as any;
      const user = {
        id: "123",
        email: "venki@gmail.com",
        password: "hashedPass",
        name: "Venki Rao",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const refreshToken = {
        id: "token_id",
        token: await bcrypt.hash("refresh_token", 10),
        expiry: new Date(Date.now() + 10000),
        email: user.email,
        tokenType: TokenType.JWT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(mongoPrismaService.user, "findFirst").mockResolvedValue(user);
      jest.spyOn(tokenService, "findByQuery").mockResolvedValue(refreshToken);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => true);
      jest
        .spyOn(service, "createTokens")
        .mockResolvedValue({ accessToken: "access_token", refreshToken: "refresh_token" });

      const result = await service.refreshToken(req);
      expect(result).toEqual({
        user: { name: user.name, status: user.status },
        accessToken: "access_token",
      });
    });

    it("should throw UnauthorizedException if refresh token is expired", async () => {
      const req = { user: { sub: "123", refreshToken: "refresh_token" } } as any;
      const user = {
        id: "123",
        email: "venki@gmail.com",
        name: "Venki Rao",
        password: "hashedPass",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const refreshToken = {
        id: "token_id",
        token: await bcrypt.hash("refresh_token", 10),
        expiry: new Date(Date.now() - 10000),
        email: user.email,
        tokenType: TokenType.JWT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(mongoPrismaService.user, "findFirst").mockResolvedValue(user);
      jest.spyOn(tokenService, "findByQuery").mockResolvedValue(refreshToken);

      await expect(service.refreshToken(req)).rejects.toThrow(UnauthorizedException);
    });

    it("should throw ForbiddenException if refresh token is invalid", async () => {
      const req = { user: { sub: "123", refreshToken: "invalid_refresh_token" } } as any;
      const user = {
        id: "123",
        email: "venki@gmail.com",
        name: "Venki Rao",
        password: "hashedPass",
        status: UserStatus.ACTIVE,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const refreshToken = {
        id: "token_id",
        token: await bcrypt.hash("refresh_token", 10),
        expiry: new Date(Date.now() + 10000),
        email: user.email,
        tokenType: TokenType.JWT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(mongoPrismaService.user, "findFirst").mockResolvedValue(user);
      jest.spyOn(tokenService, "findByQuery").mockResolvedValue(refreshToken);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => false);

      await expect(service.refreshToken(req)).rejects.toThrow(ForbiddenException);
    });
  });
});
