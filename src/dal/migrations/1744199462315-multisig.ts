import { MigrationInterface, QueryRunner } from 'typeorm';

export class Multisig1744199462315 implements MigrationInterface {
  name = 'Multisig1744199462315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "multisigs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "multisig_address" character varying NOT NULL, "multisig_name" character varying NOT NULL, "multisig_description" character varying NOT NULL, "multisig_members" jsonb NOT NULL DEFAULT '[]', "multisig_threshold" integer NOT NULL, CONSTRAINT "PK_b56baecb7844babe295d4cc5678" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "multisigs"`);
  }
}
