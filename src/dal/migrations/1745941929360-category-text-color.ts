import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryTextColor1745941929360 implements MigrationInterface {
  name = 'CategoryTextColor1745941929360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forum_categories" ADD "text_color" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forum_categories" DROP COLUMN "text_color"`,
    );
  }
}
