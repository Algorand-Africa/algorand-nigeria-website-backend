import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForumsInit1745923653481 implements MigrationInterface {
  name = 'ForumsInit1745923653481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "message" character varying NOT NULL, "upvotes" integer NOT NULL DEFAULT '0', "downvotes" integer NOT NULL DEFAULT '0', "answered" boolean NOT NULL DEFAULT false, "category_id" character varying NOT NULL, "commenter_id" character varying NOT NULL, "parent_id" character varying, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forum_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "color" character varying, "image" character varying, "visibility" character varying NOT NULL, "slug" character varying NOT NULL, "creator_id" character varying NOT NULL, CONSTRAINT "UQ_c4514e6744ff9e613f20eb108f0" UNIQUE ("slug"), CONSTRAINT "PK_502afa07fc57ce4b302dc00217e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "forum_categories"`);
    await queryRunner.query(`DROP TABLE "comments"`);
  }
}
