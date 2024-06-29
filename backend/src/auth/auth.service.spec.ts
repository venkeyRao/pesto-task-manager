import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("AuthService", () => {
  let service: AuthService;

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
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
