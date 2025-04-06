import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventUpdate1743942793733 implements MigrationInterface {
  name = 'EventUpdate1743942793733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD "attendance_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "attendance_link" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN "attendance_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN "attendance_token"`,
    );
  }
}
