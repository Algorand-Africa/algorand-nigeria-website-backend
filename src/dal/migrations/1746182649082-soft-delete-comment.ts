import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeleteComment1746182649082 implements MigrationInterface {
  name = 'SoftDeleteComment1746182649082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deleted_at"`);
  }
}
