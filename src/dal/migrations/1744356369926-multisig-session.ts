import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultisigSession1744356369926 implements MigrationInterface {
  name = 'MultisigSession1744356369926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "multisig-sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "multisig_id" character varying NOT NULL, "session_token" character varying NOT NULL, "txns" jsonb NOT NULL DEFAULT '[]', "members_that_signed" jsonb NOT NULL DEFAULT '[]', "minimum_signatures" integer NOT NULL, CONSTRAINT "PK_a10bc62807e1e47a82449e423d3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "multisig-sessions"`);
  }
}
