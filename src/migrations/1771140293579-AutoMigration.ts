import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1771140293579 implements MigrationInterface {
  name = 'AutoMigration1771140293579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."funder" ADD "fullname" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder" DROP COLUMN "fullname"`,
    );
  }
}
