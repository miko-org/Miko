import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateEnitity1598380644476 implements MigrationInterface {
	name = 'MigrateEnitity1598380644476';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "base_guild" RENAME COLUMN "member_count" TO "size"`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "modlog" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "mutedRole" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "privateManager" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannelType" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannel" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeMessage" SET DEFAULT null`);
		await queryRunner.query(`ALTER TABLE "base_member" ALTER COLUMN "money" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_shop_role" ALTER COLUMN "cost" SET DEFAULT 0`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "base_shop_role" ALTER COLUMN "cost" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_member" ALTER COLUMN "money" SET DEFAULT 0`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeMessage" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannel" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "welcomeChannelType" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "privateManager" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "mutedRole" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_settings" ALTER COLUMN "modlog" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "base_guild" RENAME COLUMN "size" TO "member_count"`);
	}
}
