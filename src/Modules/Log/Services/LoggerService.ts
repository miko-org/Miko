import { BaseService } from '../../../Framework/Services/Service';
import { BaseEventLog } from '../Others/EventLog';
import { LogType } from '../Others/LogType';
import { resolve, relative } from 'path';
import { glob } from 'glob';

import { Service } from '../../../Framework/Decorators/Service';
import { MessagingService } from '../../../Framework/Services/Messaging';

export class LoggingService extends BaseService {
	@Service() protected messages: MessagingService;

	private logs: Map<LogType, BaseEventLog> = new Map();

	public async init() {
		console.log('Loading log events...');

		const files = glob.sync('./bin/Modules/Log/Events/*.js');

		for (const file of files) {
			const clazz = require(resolve(__dirname, `../../../../${file}`));

			if (clazz) {
				const constr = clazz.default;
				const parent = Object.getPrototypeOf(constr);

				if (!parent || parent.name !== 'BaseEventLog') {
					continue;
				}

				const inst: BaseEventLog = new constr(this.client);

				if (this.logs.has(inst.type)) {
					console.error(`Duplicate event log #${inst.type} in ${relative(process.cwd(), file)}`);
					process.exit(1);
				}

				this.logs.set(inst.type, inst);
			}
		}

		console.log(`Loaded ${this.logs.size} events log.`);
	}
}
