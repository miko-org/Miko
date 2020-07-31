import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const ts = new Set(['true', 'on', 'y', 'yes', 'enable', 'вкл', 'включить']);
const fs = new Set(['false', 'off', 'n', 'no', 'disable', 'выкл', 'выключить']);

export class BooleanResolver extends Resolver {
	public async resolve(value: string, { funcs: { t } }: Context): Promise<boolean> {
		if (typeof value === typeof undefined) {
			return;
		}

		value = value.toLowerCase();

		if (ts.has(value)) {
			return true;
		}

		if (fs.has(value)) {
			return false;
		}

		throw Error(t(`resolvers.boolean.invalid`));
	}
}
