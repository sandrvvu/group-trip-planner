import { Controller, Get, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { PublicUser } from "@repo/shared";
import type { AuthUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { toPublicUser } from "./user.mapper.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() currentUser: AuthUser): Promise<PublicUser> {
    const user = await this.usersService.findById(currentUser.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return toPublicUser(user);
  }
}
