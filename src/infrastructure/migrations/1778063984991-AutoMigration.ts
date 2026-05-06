import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1778063984991 implements MigrationInterface {
  name = 'AutoMigration1778063984991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP CONSTRAINT "FK_78ba97ce03dc4edcac11279cc22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP CONSTRAINT "FK_a8d88ca3da6404b3b37e24d6eca"`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."protected_area_funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "protectedAreaId" uuid NOT NULL, "fundingId" uuid NOT NULL, CONSTRAINT "PK_cb29ddc38a50291dc3c918c97bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."disbursement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "note" text, "amount" double precision, "currency" character varying, "amountInEuro" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fundingId" uuid NOT NULL, CONSTRAINT "PK_463ed35f32b733386261ab7d7fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."activity_funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "activityId" uuid NOT NULL, "fundingId" uuid NOT NULL, CONSTRAINT "PK_53f220dd7199afc74d23650fc50" PRIMARY KEY ("id"))`,
    );
    // funder_funding, roles, user_roles, password_reset_tokens, email_verification_tokens, users
    // already exist from prior migrations — skip their CREATE TABLE statements

    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "funderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "protectedAreaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "amountInEuro" double precision`,
    );
    // "createdAt" on funding was added in AutoMigration1771330881953, skip it too
    // await queryRunner.query(`ALTER TABLE "public"."funding" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);

    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`,
    );

    // Add constraints for new tables only
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" ADD CONSTRAINT "FK_aeb3af89991a1d666f8306d9a24" FOREIGN KEY ("protectedAreaId") REFERENCES "public"."protected_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" ADD CONSTRAINT "FK_e314f2396d3a898f2d101c51bad" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."disbursement" ADD CONSTRAINT "FK_594eb14dd180c58e2006ba0ef1a" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."activity_funding" ADD CONSTRAINT "FK_b69d8aa9a78d7346a983c39eed7" FOREIGN KEY ("activityId") REFERENCES "public"."activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."activity_funding" ADD CONSTRAINT "FK_932dbe5aaf9a9e834ae58468c95" FOREIGN KEY ("fundingId") REFERENCES "public"."funding"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // funder_funding FK was already added in AutoMigration1771327625786, skip it
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
      `ALTER TABLE "public"."activity_funding" DROP CONSTRAINT "FK_932dbe5aaf9a9e834ae58468c95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."activity_funding" DROP CONSTRAINT "FK_b69d8aa9a78d7346a983c39eed7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."disbursement" DROP CONSTRAINT "FK_594eb14dd180c58e2006ba0ef1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" DROP CONSTRAINT "FK_e314f2396d3a898f2d101c51bad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area_funding" DROP CONSTRAINT "FK_aeb3af89991a1d666f8306d9a24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" DROP COLUMN "amountInEuro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "protectedAreaId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD "funderId" uuid`,
    );
    await queryRunner.query(`DROP TABLE "public"."users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b28b18b8416ccc1c593f55ce1"`,
    );
    await queryRunner.query(`DROP TABLE "public"."email_verification_tokens"`);
    await queryRunner.query(`DROP TABLE "public"."password_reset_tokens"`);
    await queryRunner.query(`DROP TABLE "public"."user_roles"`);
    await queryRunner.query(`DROP TABLE "public"."roles"`);
    await queryRunner.query(`DROP TABLE "public"."funder_funding"`);
    await queryRunner.query(`DROP TABLE "public"."activity_funding"`);
    await queryRunner.query(`DROP TABLE "public"."activity"`);
    await queryRunner.query(`DROP TABLE "public"."disbursement"`);
    await queryRunner.query(`DROP TABLE "public"."protected_area_funding"`);
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD CONSTRAINT "FK_a8d88ca3da6404b3b37e24d6eca" FOREIGN KEY ("funderId") REFERENCES "public"."funder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."funding" ADD CONSTRAINT "FK_78ba97ce03dc4edcac11279cc22" FOREIGN KEY ("protectedAreaId") REFERENCES "public"."protected_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
