import { MigrationInterface, QueryRunner } from 'typeorm';

export class BasicEntities1743608018692 implements MigrationInterface {
  name = 'BasicEntities1743608018692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'email_verification', "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'USER', "email_verified_at" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL DEFAULT 'ACTIVE', "last_login_at" TIMESTAMP, "phone" character varying, "profile_picture_url" character varying, "preferences" jsonb DEFAULT '{"securityAlerts":{"loginAttempt":"disabled","passwordChange":false},"systemNotifications":{"email":true,"sms":false,"mobilePush":false,"browser":false},"notificationPreferences":{"assetUpdates":"none","maintenanceReminders":"none"},"systemPreferences":{"dateFormat":"MM/DD/YYYY"}}', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
