import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1781464604818 implements MigrationInterface {
    name = 'AutoMigration1781464604818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" DROP CONSTRAINT "FK_734aac86a5a014880619208ee54"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" DROP CONSTRAINT "FK_8f8188f776a162391b0ed5bd9f3"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "protectedAreaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "partnerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" DROP CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2"`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" DROP CONSTRAINT "FK_10f285d038feb767bf7c2da14b3"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ADD CONSTRAINT "FK_734aac86a5a014880619208ee54" FOREIGN KEY ("protectedAreaId") REFERENCES "public"."protected_area"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ADD CONSTRAINT "FK_8f8188f776a162391b0ed5bd9f3" FOREIGN KEY ("partnerId") REFERENCES "public"."partner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ADD CONSTRAINT "FK_10f285d038feb767bf7c2da14b3" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" DROP CONSTRAINT "FK_10f285d038feb767bf7c2da14b3"`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" DROP CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2"`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" DROP CONSTRAINT "FK_8f8188f776a162391b0ed5bd9f3"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" DROP CONSTRAINT "FK_734aac86a5a014880619208ee54"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ADD CONSTRAINT "FK_10f285d038feb767bf7c2da14b3" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."email_verification_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."password_reset_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."roles" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "partnerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "protectedAreaId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ADD CONSTRAINT "FK_8f8188f776a162391b0ed5bd9f3" FOREIGN KEY ("partnerId") REFERENCES "public"."partner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area_partner" ADD CONSTRAINT "FK_734aac86a5a014880619208ee54" FOREIGN KEY ("protectedAreaId") REFERENCES "public"."protected_area"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
