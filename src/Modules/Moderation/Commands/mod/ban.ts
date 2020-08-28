import { Command, Context } from '../../../../Framework/Commands/Command';
import { BaseClient } from '../../../../Client';
import { CommandGroup } from '../../../../Misc/Models/CommandGroup';
import { Message, Member } from 'eris';
import { BaseMember } from '../../../../Entity/Member';
import { ExecuteError } from '../../../../Framework/Errors/ExecuteError';
import { Color } from '../../../../Misc/Enums/Colors';
import { MemberResolver, StringResolver } from '../../../../Framework/Resolvers';
import { GuildPermission } from '../../../../Misc/Models/GuildPermissions';
import { Punishment, BasePunishment } from '../../../../Entity/Punishment';
import { Images } from '../../../../Misc/Enums/Images';

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
					full: true
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
		[member, r]: [Member, string],
		{ funcs: { t, e }, guild, me, settings }: Context
	) {
		const reason = r || t('moderation.noreason');
		const extra = [
			{ name: 'logs.mod.reason', value: reason },
			{ name: 'logs.mod.duration', value: `∞` }
		];

		const embed = this.client.messages.createEmbed({
			color: Color.DARK,
			author: { name: t('moderation.ban.title'), icon_url: Images.MODERATION },
			description: t('moderation.ban.done', {
				user: `${message.author.username}#${message.author.discriminator}`,
				target: `${member.user.username}#${member.user.discriminator}`
			}),
			fields: extra.map((x) => {
				return {
					name: t(x.name),
					value: x.value,
					inline: true
				};
			}),
			footer: null
		});

		if (this.client.moderation.isPunishable(guild, member, message.member, me)) {
			await BasePunishment.informUser(t, member, Punishment.MUTE, extra);

			try {
				await guild.banMember(member.id, 7, encodeURIComponent(reason));

				await BaseMember.saveMembers(guild, [member]);

				await BasePunishment.new({
					client: this.client,
					settings,
					member: message.member,
					target: member,
					extra,
					opts: {
						type: Punishment.BAN,
						args: '',
						reason,
						moderator: message.author.id
					}
				});
			} catch (err) {
				throw new ExecuteError(t('moderation.ban.error'));
			}
		} else {
			throw new ExecuteError(t('moderation.ban.cannot'));
		}

		await this.replyAsync(message, t, embed);
	}
}
