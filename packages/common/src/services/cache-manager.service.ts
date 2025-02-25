import { Injectable } from '@nestjs/common';
import { LoadingCache } from '../helpers';
import type { ICacheOptions, Constructor } from '../interfaces';

@Injectable()
export class CacheManager {
	private storage: Map<string, LoadingCache<unknown, unknown>> = new Map();

	public async get<V, K>(clazz: Constructor<V>, key: K, supplier?: ICacheOptions<K, V>['load']): Promise<V> {
		const cache = this.getCache(clazz);

		let value = await cache.get(key);

		if (value === null && !!supplier) {
			value = await supplier(key);

			cache.set(key, value);
		}

		return <V>value;
	}

	public delete<V, K>(clazz: Constructor<V> | string, key: K): void {
		const cache = this.getCache(clazz);

		if (cache !== null) {
			cache.delete(key);
		}
	}

	private getCache<V>(clazz: Constructor<V> | string) {
		const cacheName = typeof clazz === 'string' ? clazz : clazz.name;

		let cache = this.storage.get(cacheName);

		if (!cache) {
			cache = new LoadingCache();
			this.storage.set(cacheName, cache);
		}

		return cache;
	}
}
