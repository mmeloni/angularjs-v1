import { ProviderCache } from './cache';

interface MockedType {
    id: number;
    name: string;
}

describe('Cache', () => {
    it('should be created', () => {
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        expect(cache).toBeDefined();
    });

    it('should have a store', () => {
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        expect(cache.store).toBeTruthy();
    });

    it('should have a put method that return the same item passed as parameter', () => {
        const item = { id: 1, name: 'Name' };
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        expect(cache.put).toBeDefined();
        expect(cache.put(item.id, item)).toBeTruthy();
        expect(cache.put(item.id, item).id).toBe(item.id);
        expect(cache.put(item.id, item).name).toBe(item.name);
    });

    it('should have a get method', () => {
        const item = { id: 1, name: 'Name' };
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        cache.put(item.id, item);

        expect(cache.get).toBeDefined();
        expect(cache.get(1)).toBeTruthy();
        expect(cache.get(1).id).toBe(1);
        expect(cache.get(1).name).toBe('Name');
    });

    it('should have a storeArrayBy method that return the same array passed as parameter', () => {
        const items = [ { id: 1, name: 'Name' }, { id: 2, name: 'Name' } ];
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        expect(cache.storeArrayBy).toBeTruthy();

        cache.storeArrayBy('id', items);

        expect(Object.keys(cache.store).length).toBe(items.length);
    });

    it('should have a clear method that empty the store', () => {
        const items = [ { id: 1, name: 'Name' }, { id: 2, name: 'Name' } ];
        const cache: ProviderCache<MockedType> = new ProviderCache<MockedType>();

        expect(cache.clear).toBeDefined();

        cache.storeArrayBy('id', items);
        expect(Object.keys(cache.store).length).toBe(items.length);

        cache.clear();

        expect(Object.keys(cache.store).length).toBe(0);
    });
});
