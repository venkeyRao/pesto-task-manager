import { IsNotEmpty } from "class-validator";
import { TokenType } from "@prisma/client";

export class CreateTokenDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  expiry: Date;

  @IsNotEmpty()
  tokenType: TokenType;

  @IsNotEmpty()
  token: string;
}
