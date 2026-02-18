import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1771391326808 implements MigrationInterface {
  name = 'AutoMigration1771391326808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."funder_funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "funderId" uuid, "fundingId" uuid, CONSTRAINT "PK_aa58afc2c2d35e3116474d10bf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_12d8a4414b4c5a9c309e71f769e" FOREIGN KEY ("funderId") REFERENCES "public"."funder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_9b5f2938c690aeed03e2bcff01b" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP CONSTRAINT "FK_9b5f2938c690aeed03e2bcff01b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP CONSTRAINT "FK_12d8a4414b4c5a9c309e71f769e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(`DROP TABLE "public"."funder_funding"`);
  }
}
