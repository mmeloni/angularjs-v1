import { Injectable } from '@angular/core';
import { StateProvider } from '../../providers/state.provider';
import { ShardState } from './types';

@Injectable()
export class ShardStateProvider extends StateProvider<ShardState> {
    constructor() {
        super({
            userPopOverOpen: false,
            placePopOverOpen: false
        });
    }
}
