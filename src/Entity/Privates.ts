import { BaseEntity, Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class BasePrivate extends BaseEntity {
	@PrimaryColumn({ type: 'bigint' })
	public id: string;

	@Column()
	public owner: string;

	@CreateDateColumn()
	public createdAt: Date;
}
