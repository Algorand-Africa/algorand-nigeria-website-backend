import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForumEntities1745939619527 implements MigrationInterface {
  name = 'ForumEntities1745939619527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" character varying NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "poster_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'open', CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "post_id" character varying NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_32fe67d8cdea0e7536320d7c454" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "saved_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "post_id" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_868375ca4f041a2337a1c1a6634" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "post_id" character varying NOT NULL, "voter_id" character varying NOT NULL, "vote_type" character varying NOT NULL, CONSTRAINT "PK_9582da033a0549ccd393cabe385" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "comment_id" character varying NOT NULL, "voter_id" character varying NOT NULL, "vote_type" character varying NOT NULL, CONSTRAINT "PK_2f0e8a57401e7d3fc0e966e771e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "upvotes"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "downvotes"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "answered"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "category_id"`);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "post_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "category_id" 'character varying' NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "answered" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "downvotes" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "upvotes" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "comment_votes"`);
    await queryRunner.query(`DROP TABLE "post_votes"`);
    await queryRunner.query(`DROP TABLE "saved_posts"`);
    await queryRunner.query(`DROP TABLE "post_images"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
