import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1771156326830 implements MigrationInterface {
  name = 'AutoMigration1771156326830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "projectId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD CONSTRAINT "FK_714b6d8c1870167c49e98b85980" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP CONSTRAINT "FK_714b6d8c1870167c49e98b85980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "projectId"`,
    );
  }
}
