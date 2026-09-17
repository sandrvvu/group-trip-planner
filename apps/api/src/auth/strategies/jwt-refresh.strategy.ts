import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Env } from "../../config/env.schema.js";
import {
  REFRESH_TOKEN_COOKIE,
  type RefreshAuthUser,
  type RefreshJwtPayload,
} from "../auth.types.js";

function fromRefreshCookie(request: Request): string | null {
  const token: unknown = request.cookies?.[REFRESH_TOKEN_COOKIE];
  return typeof token === "string" && token.length > 0 ? token : null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromRefreshCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_REFRESH_SECRET", { infer: true }),
      algorithms: ["HS256"],
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: RefreshJwtPayload): RefreshAuthUser {
    const refreshToken = fromRefreshCookie(request);
    if (!refreshToken || typeof payload.sub !== "string") {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, refreshToken };
  }
}
