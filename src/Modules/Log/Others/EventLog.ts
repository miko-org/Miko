import { BaseClient } from '../../../Client';
import { LogType } from './LogType';
import { Embed, Guild, Emoji, TextChannel } from 'eris';
import { GuildPermission } from '../../../Misc/Models/GuildPermissions';
import { TranslateFunc } from '../../../Framework/Commands/Command';
import { withScope, captureException } from '@sentry/node';

import i18n from 'i18n';
import { Cache } from '../../../Framework/Decorators/Cache';
import { GuildSettingsCache } from '../../../Framework/Cache';
import { Service } from '../../../Framework/Decorators/Service';
import { MessagingService } from '../../../Framework/Services/Messaging';
import { IgnoreError } from '../../../Framework/Errors/IgnoreError';

export abstract class BaseEventLog {
	@Service() protected messages: MessagingService;
	@Cache() protected guilds: GuildSettingsCache;

	public type: LogType;
	public client: BaseClient;

	public constructor(client: BaseClient, type: LogType) {
		this.client = client;
		this.type = type;

		client.setupInjections(this);
	}

	public abstract async execute(t: TranslateFunc, ...args: any[]): Promise<Embed>;

	public async getAuditLog(guild: Guild, user: { id: string }, type: number) {
		let me = guild.members.get(this.client.user.id) || (await guild.getRESTMember(this.client.user.id));
		const viewAudit = me.permission.has(GuildPermission.VIEW_AUDIT_LOGS);

		if (!viewAudit) return;

		const auditLogs = await guild.getAuditLogs(undefined, undefined, type);
		const auditLogEntry = auditLogs.entries.find((l) => l.targetID === user.id);

		if (auditLogEntry && auditLogEntry.user.id === this.client.user.id) {
			throw new IgnoreError();
		}

		return auditLogEntry;
	}

	protected async handleEvent(guild: Guild, ...args: any[]) {
		if (!guild) {
			return;
		}

		const sets = await this.guilds.get(guild);

		if (sets.logger.enabled !== true) {
			return;
		}

		if (!sets.logger.events[this.type]) {
			return;
		}

		const channel = guild.channels.get(sets.logger.events[this.type]) as TextChannel;

		if (!channel) {
			return;
		}

		const t: TranslateFunc = (phrase, replacements) => i18n.__({ locale: sets.locale, phrase }, replacements);

		try {
			const embed: Embed = await this.execute(t, guild, ...args);

			if (!embed) {
				return;
			}

			await this.messages.sendEmbed(channel, embed);
		} catch (err) {
			if (err instanceof IgnoreError) {
				return;
			}

			console.error(err);

			withScope((scope) => {
				scope.setTag('log action', String(this.type));
				scope.setExtra('guild', guild.id);

				captureException(err);
			});
		}
	}

	public footer(a: { id: string }) {
		return {
			text: `ID: ${a.id}`
		};
	}

	public emoji(emoji: Emoji) {
		return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
	}

	protected compare(source: any, target: any) {
		return Object.entries(target)
			.map(([key, val]) => {
				if (typeof val === 'object' || typeof source[key] === 'object') return;

				if (source[key] !== val)
					return {
						key,
						old: val,
						new: source[key]
					};

				return null;
			})
			.filter((x) => !!x);
	}
}