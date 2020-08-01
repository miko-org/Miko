import { Command, Context } from '../../../Framework/Commands/Command';
import { BaseClient } from '../../../Client';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { Message, Member } from 'eris';
import { BaseMember } from '../../../Entity/Member';
import { ExecuteError } from '../../../Framework/Errors/ExecuteError';

import moment from 'moment';
import { Color } from '../../../Misc/Enums/Colors';
import { ColorResolve } from '../../../Misc/Utils/ColorResolver';
import { MemberResolver, StringResolver } from '../../../Framework/Resolvers';
import { GuildPermission } from '../../../Misc/Enums/GuildPermissions';
import { Punishment, BasePunishment } from '../../../Entity/Punishment';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'ban',
			aliases: ['бан', 'забанить'],
			group: CommandGroup.MODERATION,
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			guildOnly: true,
			botPermissions: [GuildPermission.BAN_MEMBERS],
			userPermissions: [GuildPermission.BAN_MEMBERS],
			premiumOnly: false
		});
	}

	public async execute(
		message: Message,
		[member, reason]: [Member, string],
		{ funcs: { t, e }, guild, me, settings }: Context
	) {
		reason = reason || t('modules.moderation.noreason');

		const embed = this.client.messages.createEmbed(
			{
				color: ColorResolve(Color.RED),
				title: t('modules.moderation.ban.title'),
				footer: {
					text: ''
				}
			},
			false
		);

		if (member && this.client.moderation.isPunishable(guild, member, message.member, me)) {
			if (member) {
				await BasePunishment.informUser(member, Punishment.BAN, settings, { reason });
			}

			try {
				await guild.banMember(member.id, 7, encodeURIComponent(reason));

				await BaseMember.saveMembers(guild, [member]);

				await BasePunishment.new(guild, {
					member: member.id,
					type: Punishment.BAN,
					amount: 0,
					args: '',
					reason,
					moderator: message.author.id
				});

				embed.color = ColorResolve(Color.PEACH);
				embed.description = t('modules.moderation.ban.done', {
					user: `${message.author.username}#${message.author.discriminator}`,
					target: `${member.user.username}#${member.user.discriminator}`
				});
			} catch (err) {
				embed.description = t('modules.moderation.ban.error');
			}
		} else {
			embed.description = t('modules.moderation.ban.canNotBan');
		}

		await this.replyAsync(message, t, embed);
	}
}
