import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771567734236 implements MigrationInterface {
    name = 'AutoMigration1771567734236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."protected_area" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`);
    }

}
