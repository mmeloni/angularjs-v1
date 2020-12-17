import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../shared/user/user.model';
import { ShardStateProvider } from '../shard.state.provider';
import { ShardState } from '../types';

@Component({
    selector: 'wn-shard-user-avatar',
    styleUrls: [ './shard.user.avatar.component.scss' ],
    templateUrl: './shard.user.avatar.component.html'
})
export class ShardUserAvatarComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() user: User;

    public showPopover: boolean = false;
    public imageSrc: string = '/assets/img/user_empty.png';

    constructor(private shardStateProvider: ShardStateProvider) {
    }

    ngOnInit() {
        this.shardStateProvider.getState().subscribe((state: ShardState) => {
            if (!state.userPopOverOpen) {
                this.showPopover = false;
            }
        });
    }

    showPopOver() {
        this.shardStateProvider.setState({ placePopOverOpen: false });
        this.showPopover = true;
    }
}
