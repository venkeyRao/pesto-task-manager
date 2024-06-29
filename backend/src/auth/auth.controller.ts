import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { RefreshTokenGuard } from "../common/guards/refreshToken.guard";

@Controller("v1/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() createAuthDto: SignupDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post("signin")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("refresh")
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }
}
