import { Injectable } from "@nestjs/common";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PaginateFunction, paginator } from "../common/interfaces/paginate.interface";
import { exclude } from "../common/helpers/user.helper";

const paginate: PaginateFunction = paginator({ skip: 0, take: 10 });
@Injectable()
export class UserService {
  constructor(private readonly mongoPrismaService: MongoPrismaService) {}

  async findAll(params: { skip?: number; take?: number; orderBy?: string }) {
    const { skip, take, orderBy } = params;

    return await paginate(this.mongoPrismaService.user, {
      skip,
      take,
      orderBy,
    });
  }

  async findOne(id: string) {
    const user = await this.mongoPrismaService.user.findUnique({
      where: {
        id,
      },
    });

    return exclude(user, ["password"]);
  }

  findByEmail({ email }: Partial<{ email: string }>) {
    return this.mongoPrismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  findByQuery(query: object) {
    return this.mongoPrismaService.user.findRaw(query);
  }

  create(userDetails: CreateUserDto) {
    return this.mongoPrismaService.user.create({ data: userDetails });
  }
}
