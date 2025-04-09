import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerEnquiry1744190795177 implements MigrationInterface {
  name = 'CustomerEnquiry1744190795177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_enquiries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "message" character varying NOT NULL, "enquiry_type" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_33e294d8ad51d4761c13ce745a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "rsvp_link" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "rsvp_link"`);
    await queryRunner.query(`DROP TABLE "customer_enquiries"`);
  }
}
