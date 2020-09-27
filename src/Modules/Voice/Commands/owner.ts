import { BaseClient } from '../../../Client';
import { Context, BaseCommand } from '../../../Framework/Commands/Command';
import { Message, Member } from 'eris';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { MemberResolver } from '../../../Framework/Resolvers';
import { GuildPermission } from '../../../Misc/Models/GuildPermissions';
import { Images } from '../../../Misc/Enums/Images';
import { BaseModule } from '../../../Framework/Module';
import { Service } from '../../../Framework/Decorators/Service';
import { RoomService } from '../Services/RoomService';

export default class extends BaseCommand {
	@Service() protected roomService: RoomService;

	public constructor(module: BaseModule) {
		super(module, {
			name: 'voice owner',
			aliases: ['v owner'],
			group: CommandGroup.VOICE,
			args: [
				{
					name: 'member',
					resolver: MemberResolver,
					required: false
				}
			],
			guildOnly: true,
			premiumOnly: false,
			botPermissions: [GuildPermission.MANAGE_CHANNELS],
			examples: ['@user']
		});
	}

	public async execute(message: Message, [target]: [Member], { funcs: { t }, guild, settings: { prefix } }: Context) {
		const member = message.member;
		const p = await this.roomService.getRoomByVoice(t, guild, member.voiceState.channelID);

		await p.setOwner(t, member, target);

		await this.replyAsync(message, {
			author: {
				name: t(`voice.owner`, {
					member: member.tag,
					target: target.tag
				}),
				icon_url: Images.VOICE
			},
			footer: null,
			timestamp: null
		});
	}
}
