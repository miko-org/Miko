import { BaseClient } from '../../Client';
import { BaseModule } from '../../Framework/Module';
import { Lang } from '../../Misc/Enums/Languages';
import automodIgnore from './Commands/automod/automod ignore';
import automodInfo from './Commands/automod/automod info';
import disable from './Commands/automod/disable';
import enable from './Commands/automod/enable';
import ban from './Commands/mod/ban';
import kick from './Commands/mod/kick';
import mute from './Commands/mod/mute';
import tempban from './Commands/mod/tempban';
import tempmute from './Commands/mod/tempmute';
import unmute from './Commands/mod/unmute';
import purge from './Commands/purge/purge';
import warns from './Commands/warns';
import { ModerationService } from './Services/Moderation';

export class ModerationModule extends BaseModule {
	public names = {
		[Lang.en]: 'Moderation',
		[Lang.ru]: 'Модерация'
	};

	public constructor(client: BaseClient) {
		super(client);

		// Services
		this.registerService(ModerationService);

		// Commands
		this.registerCommand(automodInfo);
		this.registerCommand(automodIgnore);
		this.registerCommand(enable);
		this.registerCommand(disable);

		this.registerCommand(ban);
		this.registerCommand(kick);
		this.registerCommand(mute);
		this.registerCommand(tempban);
		this.registerCommand(tempmute);
		this.registerCommand(unmute);

		this.registerCommand(purge);
		this.registerCommand(warns);
	}
}
