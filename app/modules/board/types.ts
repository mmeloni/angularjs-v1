import { Shard } from '../shard/types';

export interface Board {
    countPlannedShards: number;
    description: string;
    id: number;
    shards: Shard[];
    title: string;
}

export type Boards = Board[];

export enum ContentSize {
    none,
    single,
    double,
    triple,
    fourOrMore
}
