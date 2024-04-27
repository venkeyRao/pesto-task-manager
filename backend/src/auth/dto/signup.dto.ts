import { IsEmail, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches } from "class-validator";
import { Match } from "../validators/match.decorator";
import { PASSWORD } from "../auth.constants";

export class SignupDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(PASSWORD.REGEX)
  password: string;

  @IsNotEmpty()
  @Match("password")
  passwordConfirmation: string;

  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;
}
