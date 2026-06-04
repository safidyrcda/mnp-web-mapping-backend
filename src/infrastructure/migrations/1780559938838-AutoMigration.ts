import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1780559938838 implements MigrationInterface {
  name = 'AutoMigration1780559938838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "superficie" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "creationYear" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "regions" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "districts" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "communes" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "populationCount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "femaleClpNumber" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ADD "maleClpNumber" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" ADD "amount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" ADD "currency" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" ADD "amountInEuro" double precision`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funder_funding_type_enum" AS ENUM('funder', 'technical_partner', 'strategical_partner')`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD "type" "public"."funder_funding_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP CONSTRAINT IF EXISTS "FK_12d8a4414b4c5a9c309e71f769e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ALTER COLUMN "funderId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ALTER COLUMN "fundingId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
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
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" DROP CONSTRAINT "FK_10f285d038feb767bf7c2da14b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" DROP CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(`
  DELETE FROM "public"."funder_funding"
  WHERE "funderId" NOT IN (SELECT "id" FROM "public"."funder")
     OR "fundingId" NOT IN (SELECT "id" FROM "public"."funding")
`);
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_12d8a4414b4c5a9c309e71f769e" FOREIGN KEY ("funderId") REFERENCES "public"."funder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_9b5f2938c690aeed03e2bcff01b" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ADD CONSTRAINT "FK_10f285d038feb767bf7c2da14b3" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" DROP CONSTRAINT "FK_10f285d038feb767bf7c2da14b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" DROP CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP CONSTRAINT "FK_9b5f2938c690aeed03e2bcff01b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP CONSTRAINT "FK_12d8a4414b4c5a9c309e71f769e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."email_verification_tokens" ADD CONSTRAINT "FK_10f285d038feb767bf7c2da14b3" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ALTER COLUMN "fundingId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ALTER COLUMN "funderId" DROP NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_9b5f2938c690aeed03e2bcff01b" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD CONSTRAINT "FK_12d8a4414b4c5a9c309e71f769e" FOREIGN KEY ("funderId") REFERENCES "public"."funder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."funder_funding_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" DROP COLUMN "amountInEuro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "maleClpNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "femaleClpNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "populationCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "communes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "districts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "regions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "creationYear"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" DROP COLUMN "superficie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funder_funding" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
