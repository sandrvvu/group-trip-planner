import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AuthResponse } from "@repo/shared";
import type { Response } from "express";
import type { Env } from "../config/env.schema.js";
import { AuthService } from "./auth.service.js";
import { REFRESH_TOKEN_COOKIE, type AuthResult, type RefreshAuthUser } from "./auth.types.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return this.respond(response, await this.authService.register(dto));
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return this.respond(response, await this.authService.login(dto));
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: RefreshAuthUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return this.respond(response, await this.authService.refresh(user.id, user.refreshToken));
  }

  private respond(response: Response, { refreshToken, ...body }: AuthResult): AuthResponse {
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: this.config.get("NODE_ENV", { infer: true }) === "production",
      path: "/auth",
      maxAge: this.config.get("JWT_REFRESH_TTL", { infer: true }) * 1000,
    });
    return body;
  }
}
