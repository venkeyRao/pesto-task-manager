import { IsOptional, IsNotEmpty, MaxLength } from "class-validator";
import { TaskStatus } from "@prisma/client";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @MaxLength(100)
  description?: string;

  @IsOptional()
  status?: TaskStatus;
}
