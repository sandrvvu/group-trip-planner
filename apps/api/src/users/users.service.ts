import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity.js";

export type CreateUserData = Pick<User, "email" | "name" | "passwordHash">;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();
  }

  findByIdWithRefreshTokenHash(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.refreshTokenHash")
      .where("user.id = :id", { id })
      .getOne();
  }

  create(data: CreateUserData): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async rotateRefreshTokenHash(
    id: string,
    expectedHash: string,
    nextHash: string,
  ): Promise<boolean> {
    const result = await this.refreshTokenHashUpdate(nextHash)
      .where("id = :id", { id })
      .andWhere("refresh_token_hash = :expectedHash", { expectedHash })
      .execute();

    return result.affected === 1;
  }

  async setRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.refreshTokenHashUpdate(refreshTokenHash).where("id = :id", { id }).execute();
  }

  private refreshTokenHashUpdate(refreshTokenHash: string | null) {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshTokenHash, updatedAt: () => "updated_at" });
  }
}
