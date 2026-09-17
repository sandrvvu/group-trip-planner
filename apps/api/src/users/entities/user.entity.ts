import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ name: "password_hash", type: "varchar", length: 255, select: false })
  passwordHash: string;

  @Column({
    name: "refresh_token_hash",
    type: "varchar",
    length: 64,
    nullable: true,
    select: false,
  })
  refreshTokenHash: string | null;

  @Column({ type: "varchar", length: 2048, nullable: true })
  avatar: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
