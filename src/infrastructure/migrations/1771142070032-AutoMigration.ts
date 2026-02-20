import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1771142070032 implements MigrationInterface {
  name = 'AutoMigration1771142070032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "fullname" text, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(`DROP TABLE "public"."project"`);
  }
}
