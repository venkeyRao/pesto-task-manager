import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [UserService, AuthService, TokenService, RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
