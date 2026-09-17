import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { QueryFailedError } from "typeorm";
import type { Env } from "../config/env.schema.js";
import type { User } from "../users/entities/user.entity.js";
import { toPublicUser } from "../users/user.mapper.js";
import { UsersService } from "../users/users.service.js";
import type { AuthResult, JwtPayload } from "./auth.types.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

const BCRYPT_ROUNDS = 12;
const EMAIL_TAKEN = "Email is already registered";
const INVALID_CREDENTIALS = "Invalid email or password";
const INVALID_REFRESH_TOKEN = "Invalid refresh token";

@Injectable()
export class AuthService implements OnModuleInit {
  private dummyPasswordHash = "";

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async onModuleInit(): Promise<void> {
    this.dummyPasswordHash = await hash(randomUUID(), BCRYPT_ROUNDS);
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    if (await this.usersService.findByEmail(dto.email)) {
      throw new ConflictException(EMAIL_TAKEN);
    }

    const passwordHash = await hash(dto.password, BCRYPT_ROUNDS);

    let user: User;
    try {
      user = await this.usersService.create({ email: dto.email, name: dto.name, passwordHash });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(EMAIL_TAKEN);
      }
      throw error;
    }

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const passwordMatches = await compare(
      dto.password,
      user?.passwordHash ?? this.dummyPasswordHash,
    );

    if (!user || !passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.issueTokens(user);
  }

  async refresh(userId: string, refreshToken: string): Promise<AuthResult> {
    const user = await this.usersService.findByIdWithRefreshTokenHash(userId);

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    if (!hashesEqual(sha256(refreshToken), user.refreshTokenHash)) {
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    return this.issueTokens(user, user.refreshTokenHash);
  }

  private async issueTokens(user: User, rotateFromHash?: string): Promise<AuthResult> {
    const accessPayload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.config.get("JWT_SECRET", { infer: true }),
        expiresIn: this.config.get("JWT_ACCESS_TTL", { infer: true }),
        algorithm: "HS256",
      }),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: this.config.get("JWT_REFRESH_SECRET", { infer: true }),
          expiresIn: this.config.get("JWT_REFRESH_TTL", { infer: true }),
          algorithm: "HS256",
          jwtid: randomUUID(),
        },
      ),
    ]);

    const refreshTokenHash = sha256(refreshToken);

    if (rotateFromHash === undefined) {
      await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);
    } else if (
      !(await this.usersService.rotateRefreshTokenHash(user.id, rotateFromHash, refreshTokenHash))
    ) {
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    return { user: toPublicUser(user), accessToken, refreshToken };
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hashesEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === "23505"
  );
}
