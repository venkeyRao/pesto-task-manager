import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  email: string;
}
