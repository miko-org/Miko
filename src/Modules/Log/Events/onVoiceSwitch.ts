import { BaseEventLog } from '../Others/EventLog';
import { BaseClient } from '../../../Client';
import { LogType } from '../Others/LogType';
import { TranslateFunc } from '../../../Framework/Commands/Command';
import { Guild, Member, VoiceChannel } from 'eris';
import { Color } from '../../../Misc/Enums/Colors';
import { Images } from '../../../Misc/Enums/Images';
import { Cache } from '../../../Framework/Decorators/Cache';
import { RoomCache } from '../../Voice/Cache/RoomCache';
import { GuildSettingsCache } from '../../../Framework/Cache';

export default class onVoiceSwitchEvent extends BaseEventLog {
	@Cache() rooms: RoomCache;

	public constructor(client: BaseClient) {
		super(client, LogType.VOICE_SWITCH);

		client.on('voiceChannelSwitch', this.onHandle.bind(this));
	}

	private async onHandle(member: Member, channel: VoiceChannel, oldChannel: VoiceChannel) {
		const guild = member.guild;

		const rooms = await this.rooms.get(guild);
		const sets = await this.guilds.get(guild);

		if (sets.private.manager === channel.id || sets.private.manager === oldChannel.id || rooms.has(oldChannel.id))
			return;

		await super.handleEvent(guild, member, channel, oldChannel);
	}

	public async execute(
		t: TranslateFunc,
		guild: Guild,
		member: Member,
		newChannel: VoiceChannel,
		oldChannel: VoiceChannel
	) {
		const embed = this.messages.createEmbed({
			author: { name: t('logs.voiceSwitch'), icon_url: Images.VOICE_SWITCH },
			color: Color.YELLOW,
			fields: [
				{
					name: t('logs.channel'),
					value: `\`${oldChannel.name}\` → \`${newChannel.name}\``,
					inline: true
				},
				{
					name: t('logs.member'),
					value: member.mention,
					inline: true
				}
			],
			thumbnail: { url: member.avatarURL },
			footer: {
				text: `From: ${oldChannel.id}, To: ${newChannel.id}`
			}
		});

		return embed;
	}
}
