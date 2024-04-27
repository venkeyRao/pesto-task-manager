import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateTokenDto } from "./dto/create-token.dto";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService, private mongoPrismaService: MongoPrismaService) {}

  create(data: CreateTokenDto) {
    return this.mongoPrismaService.token.create({ data: data });
  }

  createOrUpdate(query: any) {
    return this.mongoPrismaService.token.upsert(query);
  }

  findByQuery(query: any) {
    return this.mongoPrismaService.token.findFirst(query);
  }

  delete(query: any) {
    return this.mongoPrismaService.token.deleteMany({ where: query });
  }

  deleteOne(query: any) {
    return this.mongoPrismaService.token.delete({ where: query });
  }
}
