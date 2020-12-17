import { Injectable } from '@angular/core';
import { StateProvider } from '../../../providers/state.provider/state.provider';

export interface ShardState {
    userPopOverOpen?: boolean;
    placePopOverOpen?: boolean;
}

@Injectable()
export class ShardStateProvider extends StateProvider<ShardState> {

    constructor() {
        super({
            userPopOverOpen: false,
            placePopOverOpen: false
        });
    }

}
