import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [TokenService, ConfigService],
})
export class TokenModule {}
