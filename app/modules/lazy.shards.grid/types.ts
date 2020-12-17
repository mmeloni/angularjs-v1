import { Shard, Shards } from '../shard/types';

export type GridItemSize = 'single' | 'double';

export interface IGridItem {
    shard: Shard;
    size: GridItemSize;
    lastInARow?: boolean;
}

export type GridItemsPerRow = 4 | 3;
export type ShardsGridStreamType = 'stream' | 'user-stages' | 'user-tours';

export type CallbackResponse = {
    response: Shards,
    page: number
};
