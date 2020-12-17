/**
 * ProviderCache is a strong typed cache class that provides methods to handle a private cache.
 * It is intended not to be used or injected directly into components but providers.
 * It should be used by CachableProvider or NetworkProvider in order to archive code reuse and
 * perform optimized cached service provider.
 */
export class ProviderCache<T> {
    /**
     * the local cache store
     * @type {{}}
     */
    public store: { [key: string]: T } = {};

    /**
     * get an item from the local store
     * @param {string | number} key
     * @returns {T}
     */
    public get(key: string | number): T {
        return this.store[ key ];
    }

    /**
     * put an item into the local store
     * @param {string | number} key
     * @param {T} item
     * @returns {T}
     */
    public put(key: string | number, item: T): T {
        if (!this.store[ key ]) {
            const property: PropertyDescriptor = {
                value: item,
                writable: true,
                configurable: true,
                enumerable: true
            };
            Object.defineProperty(this.store, key, property);
        }

        return this.store[ key ];
    }

    /**
     * store an entire array into the local store
     * @param {string | number} key
     * @param {T[]} items
     * @returns {T[]}
     */
    public storeArrayBy(key: string | number, items: T[]): T[] {
        if (items) {
            items.forEach((item: T) => this.put(item[ key ], item));
        }
        return items;
    }

    /**
     * empty the store
     */
    public clear(): void {
        this.store = {};
    }
}
