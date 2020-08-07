import { Command, Context } from '../../../Framework/Commands/Command';
import { BaseClient } from '../../../Client';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { Message, Member, Emoji } from 'eris';
import { BaseMember } from '../../../Entity/Member';
import { ExecuteError } from '../../../Framework/Errors/ExecuteError';
import { Color } from '../../../Misc/Enums/Colors';
import { ColorResolve } from '../../../Misc/Utils/ColorResolver';
import { chance } from '../../../Misc/Utils/Chance';
import { Syntax } from '../../../Misc/Enums/Syntax';
import { BigIntResolver } from '../../../Framework/Resolvers';

const multipliers: number[] = [0.1, 0.2, 0.3, 0.5, 1.3, 1.7, 1.5, 2],
	side_arrows: string[] = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'fortune',
			aliases: ['колесо'],
			args: [
				{
					name: 'money',
					resolver: new BigIntResolver(client, 50n),
					required: true
				}
			],
			group: CommandGroup.GAMBLING,
			guildOnly: true,
			premiumOnly: false
		});
	}

	public async execute(
		message: Message,
		[bet]: [bigint],
		{
			funcs: { t, e },
			guild,
			settings: {
				emojis: { wallet }
			}
		}: Context
	) {
		const person = await BaseMember.get(message.member);

		if (person.money < bet)
			throw new ExecuteError(
				t('error.enough.money', {
					emoji: e(wallet),
					amount: bet - person.money
				})
			);

		const multiplier = chance.pickone(multipliers);
		const result = (bet * BigInt(multiplier * 100)) / 100n;

		person.money += result - bet;
		await person.save();

		let text = '',
			space = '\u200b \u200b';

		text += space.repeat(12) + `${multipliers[0].toFixed(1)}\n`;
		text += space.repeat(6) + `${multipliers[7].toFixed(1)}${space.repeat(9)}${multipliers[1].toFixed(1)}\n\u200b\n`;
		text +=
			space.repeat(4) +
			`${multipliers[6].toFixed(1)}${space.repeat(5)}${side_arrows[multipliers.indexOf(multiplier)]}${space.repeat(
				5
			)}${multipliers[2].toFixed(1)}\n\u200b\n`;
		text += space.repeat(6) + `${multipliers[5].toFixed(1)}${space.repeat(9)}${multipliers[3].toFixed(1)}\n`;
		text += space.repeat(12) + `${multipliers[4].toFixed(1)}\n`;

		let em = this.createEmbed({
			color: ColorResolve(multiplier >= 1 ? Color.GREEN : Color.RED),
			title: t('gambling.fortune.title'),
			description: t('gambling.fortune.desc', {
				circle: text.markdown(Syntax.AHK)
			}),
			fields: [
				{
					name: t('gambling.fortune.fields.bet'),
					value: `${bet} ${e(wallet)}`,
					inline: true
				},
				{
					name: t('gambling.fortune.fields.result'),
					value: `${result} ${e(wallet)}`,
					inline: true
				}
			],
			thumbnail: {
				url: 'https://i.imgur.com/9JyBh7t.png'
			}
		});

		await this.replyAsync(message, t, em);
	}
}
