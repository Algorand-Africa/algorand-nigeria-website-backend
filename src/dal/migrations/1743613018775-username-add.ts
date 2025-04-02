import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsernameAdd1743613018775 implements MigrationInterface {
  name = 'UsernameAdd1743613018775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
