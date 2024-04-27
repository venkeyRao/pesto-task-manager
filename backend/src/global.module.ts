import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongoPrismaService } from "./prisma/mongo-prisma.service";
import { CacheModule } from "@nestjs/cache-manager";
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [MongoPrismaService],
  exports: [MongoPrismaService],
})
export class GlobalModule {}
