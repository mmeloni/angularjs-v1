import { Injectable } from '@angular/core';
import { StateProvider } from '../../providers/state.provider/';
import { ProfileState } from './types';

@Injectable()
export class ProfileStateProvider extends StateProvider<ProfileState> {
    constructor() {
        super({
            currentTab: 'stages',
            variables: {
                shards: 0,
                boards: 0,
                tours: 0,
                followers: 0,
                following: 0
            }
        });
    }
}
