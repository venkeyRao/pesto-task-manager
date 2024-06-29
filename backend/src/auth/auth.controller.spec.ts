import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signup", () => {
    it("should create a new user", async () => {
      const signupDto: SignupDto = {
        name: "Test User",
        email: "venkatesh@gmail.com",
        password: "Admin1!",
        passwordConfirmation: "Admin1!",
      };

      jest.spyOn(authService, "signup").mockResolvedValue({
        user: { id: "1", name: "Test User", status: "ACTIVE" },
        tokens: { accessToken: "mockAccessToken", refreshToken: "mockRefreshToken" },
      });

      const result = await controller.signup(signupDto);
      expect(result).toBeDefined();
    });
  });

  describe("login", () => {
    it("should authenticate user and return tokens", async () => {
      const loginDto: LoginDto = {
        email: "venkatesh@gmail.com",
        password: "Admin1!",
      };

      jest.spyOn(authService, "login").mockResolvedValue({
        user: { id: "1", name: "Test User", status: "ACTIVE" },
        tokens: { accessToken: "mockAccessToken", refreshToken: "mockRefreshToken" },
      });

      const result = await controller.login(loginDto);
      expect(result).toBeDefined();
    });
  });

  describe("refresh", () => {
    it("should refresh token successfully", async () => {
      const mockReq = { user: { email: "venkatesh@gmail.com" } };
      jest.spyOn(authService, "refreshToken").mockResolvedValue({
        user: { name: "Test User", status: "ACTIVE" },
        accessToken: "mockAccessToken",
      });

      const result = await controller.refresh(mockReq as any);
      expect(result).toBeDefined();
    });
  });
});
