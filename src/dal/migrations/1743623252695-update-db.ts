import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDb1743623252695 implements MigrationInterface {
  name = 'UpdateDb1743623252695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD "slug" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "category" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "slug"`);
  }
}
