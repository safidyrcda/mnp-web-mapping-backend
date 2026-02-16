import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1771227296931 implements MigrationInterface {
  name = 'AutoMigration1771227296931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "status" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "public"."funding" ADD "debut" date`);
    await queryRunner.query(`ALTER TABLE "public"."funding" ADD "end" date`);
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "amount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "currency" character varying`,
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
      `ALTER TABLE "public"."funding" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "amount"`,
    );
    await queryRunner.query(`ALTER TABLE "public"."funding" DROP COLUMN "end"`);
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "debut"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "status"`,
    );
  }
}
