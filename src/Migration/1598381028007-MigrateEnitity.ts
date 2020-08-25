import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateEnitity1598381028007 implements MigrationInterface {
	name = 'MigrateEnitity1598381028007';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "modlog" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "mutedRole" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "privateManager" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannelType" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannel" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeMessage" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_member" ALTER COLUMN "money" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "ownerID" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "ownerID" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "name" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "name" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_shop_role" ALTER COLUMN "cost" SET DEFAULT 0`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "base_shop_role" ALTER COLUMN "cost" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "name" SET DEFAULT 'Unknown Server'`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "name" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "ownerID" SET DEFAULT '1'`);
		await queryRunner.query(`ALTER TABLE "base_guild" ALTER COLUMN "ownerID" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "base_member" ALTER COLUMN "money" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeMessage" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannel" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannelType" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "privateManager" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "mutedRole" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "modlog" DROP DEFAULT`);
	}
}
