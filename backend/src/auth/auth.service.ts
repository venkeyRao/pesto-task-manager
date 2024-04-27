import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { TokenType } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "../token/token.service";
import { JwtPayload } from "jwt-decode";
import { Request } from "express";
import { PASSWORD } from "./auth.constants";
import crypto from "crypto";
import { MongoPrismaService } from "../prisma/mongo-prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
    private mongoPrismaService: MongoPrismaService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail({ email });

    if (!user) throw new NotFoundException("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ForbiddenException("Invalid Password");

    const tokens = await this.createTokens(user.id, email);

    return {
      user: {
        id: user.id,
        name: user.name,
        status: user.status,
      },
      tokens: tokens,
    };
  }

  async createTokens(userId: string, email: string) {
    const tokens = await this.getJwtTokens(userId, email);

    await this.tokenService.createOrUpdate({
      where: {
        email_tokenType: {
          email,
          tokenType: TokenType.JWT,
        },
      },
      update: {
        token: await bcrypt.hash(tokens.refreshToken, PASSWORD.SALT),
        expiry: await this.getTokenExpiry(tokens.refreshToken),
      },
      create: {
        email,
        token: await bcrypt.hash(tokens.refreshToken, PASSWORD.SALT),
        expiry: await this.getTokenExpiry(tokens.refreshToken),
        tokenType: TokenType.JWT,
      },
    });

    return tokens;
  }

  async getTokenExpiry(token: string) {
    const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(token) as JwtPayload;
    return new Date(decodedJwtAccessToken.exp! * 1000);
  }

  async getJwtTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_EXPIRES_IN"),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN"),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(req: Request) {
    const userId = req.user["sub"];
    const token = req.user["refreshToken"];
    const user = await this.mongoPrismaService.user.findFirst({ where: { id: userId } });

    if (!user) throw new NotFoundException("User not found");

    const refreshToken = await this.tokenService.findByQuery({
      where: {
        email: user.email,
        tokenType: TokenType.JWT,
      },
    });

    if (!refreshToken) throw new ForbiddenException("Token not found");

    const isTokendValid = await bcrypt.compare(token, refreshToken.token);

    if (!isTokendValid) throw new ForbiddenException("Invalid Token");

    if (new Date(refreshToken.expiry) < new Date()) throw new UnauthorizedException("Refresh Token Expired");

    const tokens = await this.createTokens(user.id, refreshToken.email);

    return {
      user: {
        name: user.name,
        status: user.status,
      },
      accessToken: tokens.accessToken,
    };
  }

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    const dbUser = await this.usersService.findByEmail({ email });

    if (dbUser) throw new ForbiddenException("User already registred");

    const hashedPassword = await bcrypt.hash(password, PASSWORD.SALT);

    try {
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
        name,
      });
      const tokens = await this.createTokens(user.id, email);

      return {
        user: {
          id: user.id,
          name: user.name,
          status: user.status,
        },
        tokens: tokens,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async createTokenAndExpiry() {
    const token = crypto.randomUUID();
    const expiry = new Date();

    expiry.setUTCDate(expiry.getUTCDate() + 1);

    return {
      token,
      expiry,
    };
  }
}
