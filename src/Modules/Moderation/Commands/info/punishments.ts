import { BaseCommand, Context } from '../../../../Framework/Commands/Command';
import { Message, Member, EmbedField } from 'eris';
import { Color } from '../../../../Misc/Enums/Colors';
import { MemberResolver } from '../../../../Framework/Resolvers';
import { BasePunishment } from '../../../../Entity/Punishment';
import { Images } from '../../../../Misc/Enums/Images';
import { BaseModule } from '../../../../Framework/Module';
import moment from 'moment';
import { ExecuteError } from '../../../../Framework/Errors/ExecuteError';

const PUNISHMENT_PER_PAGE = 5;

export default class extends BaseCommand {
	public constructor(module: BaseModule) {
		super(module, {
			name: 'punishments',
			aliases: ['наказания', 'penalties'],
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					required: false
				}
			],
			guildOnly: true,
			premiumOnly: false,
			examples: ['@user']
		});
	}

	public async execute(message: Message, [target]: [Member], { funcs: { t, e }, guild }: Context) {
		const member = target || message.member;

		const punishments = await BasePunishment.find({
			where: {
				guild: { id: guild.id },
				member: member.id
			},
			take: 100,
			order: {
				createdAt: 'DESC'
			}
		});

		if (punishments.length < 1) throw new ExecuteError(t('moderation.punishs.empty'));

		const maxPage = Math.ceil(punishments.length / PUNISHMENT_PER_PAGE);
		const startPage = 0;

		await this.showPaginated(message, startPage, maxPage, (page, maxPage) => {
			const fields: EmbedField[] = [];

			punishments.slice(page * PUNISHMENT_PER_PAGE, (page + 1) * PUNISHMENT_PER_PAGE).map((p, i) => {
				const duration = !!p.date ? moment.duration(p.date.diff(p.createdAt)) : null;

				fields.push(
					{
						name: t('moderation.punishs.type'),
						value: `**${p.type.toUpperCase()}** \`(${(duration && duration.humanize(false)) || '∞'})\``,
						inline: true
					},
					{
						name: t('moderation.punishs.moderator'),
						value: `<@${p.moderator}>`,
						inline: true
					},
					{
						name: t('moderation.punishs.date'),
						value: `**${moment(p.createdAt).format('lll')}**`,
						inline: true
					}
				);
			});

			const embed = this.createEmbed({
				color: Color.DARK,
				author: { name: member.tag, icon_url: Images.MODERATION },
				thumbnail: { url: member.avatarURL },
				fields,
				footer: null,
				timestamp: null
			});

			return embed;
		});
	}
}
