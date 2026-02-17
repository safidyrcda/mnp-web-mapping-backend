import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771327886023 implements MigrationInterface {
    name = 'AutoMigration1771327886023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."funder_funding" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "public"."funder_funding" ADD "name" character varying`);
    }

}
