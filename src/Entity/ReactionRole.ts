import { BaseEntity, Entity, Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseReactionRole extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	public id: string;

	@Column({ type: 'bigint' })
	public guildId: string;

	@Column({ type: 'bigint' })
	public channelId: string;

	@Column({ type: 'bigint' })
	public messageId: string;

	@Column({ type: 'varchar' })
	public emoji: string;

	@Column({ type: 'bigint' })
	public roleId: string;

	@CreateDateColumn()
	public createdAt: Date;
}