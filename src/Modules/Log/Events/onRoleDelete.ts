import { BaseEventLog } from '../Misc/EventLog';
import { BaseClient } from '../../../Client';
import { LogType } from '../Misc/LogType';
import { TranslateFunc } from '../../../Framework/Commands/Command';
import { Guild, Constants, Role } from 'eris';
import { Color } from '../../../Misc/Enums/Colors';
import { Images } from '../../../Misc/Enums/Images';

export default class onRoleDeleteEvent extends BaseEventLog {
	public constructor(client: BaseClient) {
		super(client, LogType.ROLE_DELETE);

		client.on('guildRoleDelete', super.handleEvent.bind(this));
	}

	public async execute(t: TranslateFunc, guild: Guild, role: Role) {
		const embed = this.client.messages.createEmbed({
			author: { name: t('logs.roleDelete'), icon_url: Images.ROLE_DELETE },
			color: Color.RED,
			fields: [
				{
					name: t('logs.role'),
					value: `\`${role.name}\``,
					inline: true
				}
			],
			footer: this.footer(role)
		});

		const entry = await this.getAuditLog(guild, role, Constants.AuditLogActions.ROLE_DELETE);

		if (entry) {
			embed.fields.push({
				name: t('logs.by'),
				value: entry.user.mention,
				inline: true
			});

			embed.thumbnail = { url: entry.user.avatarURL };
		}

		return embed;
	}
}