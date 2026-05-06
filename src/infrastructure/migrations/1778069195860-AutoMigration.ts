import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1778069195860 implements MigrationInterface {
  name = 'AutoMigration1778069195860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );

    // Passage de uuid_generate_v4() à gen_random_uuid() pour les tables auth
    await queryRunner.query(
      `ALTER TABLE "public"."roles" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );

    // FK_9b5f2938 sur funder_funding a déjà été recrée en CASCADE par 1778063984991 — skip
    // Les contraintes user_roles/password_reset/email_verification sont déjà en place — skip
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."roles" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."roles" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
  }
}
