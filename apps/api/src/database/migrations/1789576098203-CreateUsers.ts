import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1789576098203 implements MigrationInterface {
  name = "CreateUsers1789576098203";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "email" character varying(255) NOT NULL,
                "name" character varying(100) NOT NULL,
                "password_hash" character varying(255) NOT NULL,
                "refresh_token_hash" character varying(64),
                "avatar" character varying(2048),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
