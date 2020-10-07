import { Column } from 'typeorm';
import { LogType } from '../Others/LogType';

export class LoggerSettings {
	@Column({ type: 'boolean', default: false, nullable: false })
	public enabled: boolean = false;

	@Column({ type: 'json', default: {}, nullable: false })
	public events: { [key in LogType]?: string } = {};

	@Column({ type: 'varchar', default: null, nullable: true })
	public moder: string = null;
}
