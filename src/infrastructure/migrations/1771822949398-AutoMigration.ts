import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771822949398 implements MigrationInterface {
    name = 'AutoMigration1771822949398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "emailConfirmationToken"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "emailConfirmationToken" character varying`);
    }

}
