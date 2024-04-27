import { IsOptional, IsNotEmpty, MaxLength } from "class-validator";
import { TaskStatus } from "@prisma/client";

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  @MaxLength(100)
  description?: string;

  @IsOptional()
  status?: TaskStatus;
}
