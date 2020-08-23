import { BaseCache } from './Cache';
import { BaseSettings } from '../../Entity/GuildSettings';

export class GuildSettingsCache extends BaseCache<BaseSettings> {
	public async init() {
		// NO-OP
	}

	public async _get(guildId: string): Promise<BaseSettings> {
		let sets = await BaseSettings.findOne(guildId);

		return sets ? sets : BaseSettings.create({ id: guildId });
	}
}
