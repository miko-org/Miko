import { BaseClient } from '../../Client';
import { BaseModule } from '../../Framework/Module';
import { Lang } from '../../Misc/Enums/Languages';
import autoassignrole from './Commands/autoassignrole';
import autosave from './Commands/autosave';
import channel from './Commands/channel';
import disable from './Commands/disable';
import enable from './Commands/enable';
import message from './Commands/message';
import { WelcomeRolesService } from './Services/WelcomeRolesService';
import { WelcomeService } from './Services/WelcomeService';

export class WelcomeModule extends BaseModule {
	public names = {
		[Lang.en]: 'Welcome',
		[Lang.ru]: 'Приветствие'
	};

	public constructor(client: BaseClient) {
		super(client);

		// Services
		this.registerService(WelcomeService);
		this.registerService(WelcomeRolesService);

		// Commands
		this.registerCommand(autoassignrole);
		this.registerCommand(autosave);
		this.registerCommand(enable);
		this.registerCommand(disable);
		this.registerCommand(message);
		this.registerCommand(channel);
	}
}
