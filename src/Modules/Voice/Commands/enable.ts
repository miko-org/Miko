import { Command, Context } from '../../../Framework/Commands/Command';
import { BaseClient } from '../../../Client';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { Message, Guild } from 'eris';
import { Color } from '../../../Misc/Enums/Colors';
import { GuildPermission } from '../../../Misc/Models/GuildPermissions';
import { ChannelType } from '../../../Types';
import { ExecuteError } from '../../../Framework/Errors/ExecuteError';
import { Images } from '../../../Misc/Enums/Images';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'voice enable',
			aliases: ['v enable'],
			args: [],
			group: CommandGroup.VOICE,
			guildOnly: true,
			premiumOnly: false,
			botPermissions: [GuildPermission.MANAGE_CHANNELS],
			userPermissions: [GuildPermission.MANAGE_GUILD]
		});
	}

	public async execute(message: Message, [], { funcs: { t, e }, guild, settings }: Context) {
		if (settings.privateManager && guild.channels.has(settings.privateManager))
			throw new ExecuteError(t('voice.enabled'));

		settings.privateManager = await this.createManager(guild);
		await settings.save();

		await this.replyAsync(message, t, {
			color: Color.MAGENTA,
			author: { name: t('voice.title'), icon_url: Images.SUCCESS },
			description: t(`voice.enable`, {
				channel: `<#${settings.privateManager}>`
			}),
			footer: null
		});
	}

	protected async createManager(guild: Guild): Promise<string> {
		const topic = await guild.createChannel('Домики Miko', ChannelType.GUILD_CATEGORY);

		const channel = await guild.createChannel('🏠 Создать домик', ChannelType.GUILD_VOICE, {
			parentID: topic.id
		});

		return channel.id;
	}
}
