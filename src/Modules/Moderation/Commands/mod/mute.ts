import { BaseCommand, Context } from '../../../../Framework/Commands/Command';
import { Message, Member } from 'eris';
import { BaseMember } from '../../../../Entity/Member';
import { ExecuteError } from '../../../../Framework/Errors/ExecuteError';
import { Color } from '../../../../Misc/Enums/Colors';
import { MemberResolver, StringResolver } from '../../../../Framework/Resolvers';
import { GuildPermission } from '../../../../Misc/Models/GuildPermissions';
import { Punishment, BasePunishment } from '../../../../Entity/Punishment';
import { Images } from '../../../../Misc/Enums/Images';
import { BaseModule } from '../../../../Framework/Module';
import { Service } from '../../../../Framework/Decorators/Service';
import { ModerationService } from '../../Services/Moderation';

export default class extends BaseCommand {
	@Service() protected moderation: ModerationService;

	public constructor(module: BaseModule) {
		super(module, {
			name: 'mute',
			aliases: ['мут', 'замутить'],
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
			botPermissions: [GuildPermission.MANAGE_ROLES],
			userPermissions: [GuildPermission.MANAGE_ROLES],
			premiumOnly: false,
			examples: ['@user', '@user 4.1']
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

		const embed = this.createEmbed({
			color: Color.DARK,
			author: { name: t('moderation.mute.title'), icon_url: Images.MODERATION },
			description: t('moderation.mute.done', {
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

		const mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			throw new ExecuteError(t('error.missed.muterole'));
		} else if (member.roles.includes(mutedRole)) {
			throw new ExecuteError(t('moderation.mute.already'));
		} else if (this.moderation.isPunishable(guild, member, message.member, me)) {
			await BasePunishment.informUser(t, member, Punishment.MUTE, extra);

			try {
				await member.addRole(mutedRole, encodeURIComponent(reason));

				await BaseMember.saveMembers(guild, [member]);

				await BasePunishment.new({
					settings,
					member: message.member,
					target: member,
					extra,
					opts: {
						type: Punishment.MUTE,
						args: '',
						reason,
						moderator: message.author.id
					}
				});
			} catch (err) {
				console.log(err);
				throw new ExecuteError(t('moderation.mute.error'));
			}
		} else {
			throw new ExecuteError(t('moderation.mute.cannot'));
		}

		await this.replyAsync(message, embed);
	}
}
