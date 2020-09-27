import { BaseClient } from '../../../Client';
import { Context, BaseCommand } from '../../../Framework/Commands/Command';
import { Message } from 'eris';
import { CommandGroup } from '../../../Misc/Models/CommandGroup';
import { GuildPermission } from '../../../Misc/Models/GuildPermissions';
import { ExecuteError } from '../../../Framework/Errors/ExecuteError';
import PermissionsOutput from '../Misc/PermissionsOutput';
import { Color } from '../../../Misc/Enums/Colors';
import { Images } from '../../../Misc/Enums/Images';
import { Cache } from '../../../Framework/Decorators/Cache';
import { PermissionsCache } from '../../../Framework/Cache';
import { BaseModule } from '../../../Framework/Module';

const PERMS_PER_PAGE = 10;

export default class extends BaseCommand {
	@Cache() protected permissions: PermissionsCache;

	public constructor(module: BaseModule) {
		super(module, {
			name: 'permissions list',
			aliases: ['список правил'],
			group: CommandGroup.PERMISSIONS,
			args: [],
			guildOnly: true,
			premiumOnly: false,
			userPermissions: [GuildPermission.ADMINISTRATOR]
		});
	}

	public async execute(message: Message, [], { funcs: { t }, guild, settings }: Context) {
		const permissions = await this.permissions.get(guild);

		if (permissions.length < 1) throw new ExecuteError(t('perms.cleared'));

		const maxPage = Math.ceil(permissions.length / PERMS_PER_PAGE);
		const startPage = 0;

		await this.showPaginated(message, startPage, maxPage, (page) => {
			const perms = permissions.slice(page * PERMS_PER_PAGE, (page + 1) * PERMS_PER_PAGE);

			return this.createEmbed({
				color: Color.MAGENTA,
				author: { name: t('perms.title'), icon_url: Images.LIST },
				description: perms.map((v, i) => PermissionsOutput(t, v, i + page * PERMS_PER_PAGE)).join('\n')
			});
		});
	}
}
