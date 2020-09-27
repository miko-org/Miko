import {
	AnyResolver,
	RoleResolver,
	MemberResolver,
	BooleanResolver,
	ChannelResolver
} from '../../../Framework/Resolvers';
import { BaseClient } from '../../../Client';
import { Context, BaseCommand } from '../../../Framework/Commands/Command';
import { Message, Member, Role, GuildChannel, TextChannel } from 'eris';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { PermissionTargetResolver } from '../Resolvers/PermissionResolver';
import { PermissionsTarget, PermissionsFrom, Permission } from '../../../Misc/Models/Permisson';
import { GuildPermission } from '../../../Misc/Models/GuildPermissions';
import { Color } from '../../../Misc/Enums/Colors';
import { Images } from '../../../Misc/Enums/Images';
import PermissionsOutput from '../Misc/PermissionsOutput';
import { ChannelType } from '../../../Types';
import { BaseModule } from '../../../Framework/Module';
import { Cache } from '../../../Framework/Decorators/Cache';
import { PermissionsCache } from '../../../Framework/Cache';

export default class extends BaseCommand {
	@Cache() protected permissions: PermissionsCache;

	public constructor(module: BaseModule) {
		super(module, {
			name: 'permission add',
			aliases: ['правило добавить'],
			group: CommandGroup.PERMISSIONS,
			args: [
				{
					name: 'module/command',
					resolver: PermissionTargetResolver,
					required: true,
					rest: true
				},
				{
					name: 'role/member/channel',
					resolver: new AnyResolver(
						module,
						new MemberResolver(module),
						new RoleResolver(module, true),
						new ChannelResolver(module, ChannelType.GUILD_TEXT)
					),
					required: true
				},
				{
					name: 'state',
					resolver: BooleanResolver,
					required: true
				}
			],
			guildOnly: true,
			premiumOnly: false,
			userPermissions: [GuildPermission.ADMINISTRATOR],
			examples: ['timely @role disable', 'all #text disable', 'ban @user enable']
		});
	}

	public async execute(
		message: Message,
		[target, from, allow]: [PermissionsTarget, Role | Member | GuildChannel, boolean],
		{ funcs: { t }, guild, settings }: Context
	) {
		const permissions = await this.permissions.get(guild);

		let perm = permissions.find((x) => x.target.id === target.id && x.activator.id === from.id);
		let isExist = !!perm;

		if (!isExist) {
			perm = {
				allow,
				index:
					Math.max.apply(
						null,
						permissions.map((p) => p.index)
					) + 1,
				target,
				activator: {
					id: from.id,
					type: null
				}
			};

			switch (from.constructor) {
				case Member:
					perm.activator.type = PermissionsFrom.User;
					break;

				case Role:
					perm.activator.type = from.id === guild.id ? PermissionsFrom.Server : PermissionsFrom.Role;
					break;

				case TextChannel:
					perm.activator.type = PermissionsFrom.Channel;
					break;
			}

			permissions.push(perm);
		} else {
			perm.allow = allow;
		}

		await this.permissions.save(guild.id, permissions);

		await this.replyAsync(message, {
			color: Color.MAGENTA,
			author: { name: t('perms.title'), icon_url: Images.SUCCESS },
			description: t(isExist ? 'perms.changed' : 'perms.add', {
				index: perm.index,
				output: PermissionsOutput(t, perm, perm.index - 1)
			})
		});
	}
}
