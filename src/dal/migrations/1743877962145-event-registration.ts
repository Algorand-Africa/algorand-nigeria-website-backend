import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventRegistration1743877962145 implements MigrationInterface {
  name = 'EventRegistration1743877962145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_registrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'registered', CONSTRAINT "PK_953d3b862c2487289a92b2356e9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_registrations"`);
  }
}
