import { IsOptional, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { UserStatus } from "@prisma/client";
import { PASSWORD } from "../../auth/auth.constants";

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(PASSWORD.REGEX)
  password: string;

  @IsOptional()
  @MaxLength(20)
  name: string;

  @IsOptional()
  status?: UserStatus;
}
