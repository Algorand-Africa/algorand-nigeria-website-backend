import { MigrationInterface, QueryRunner } from 'typeorm';

export class Events1743617600563 implements MigrationInterface {
  name = 'Events1743617600563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "location" character varying NOT NULL, "image" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL, "smart_contract_id" integer, "asa_id" integer, "event_summary" character varying, "image_gallery" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
