/**
 * This component represent a single shard element, can be used both inside
 * a grid or as a standalone component.
 * To not be confused with the shard detail page.
 */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Shard, ShardType } from './types';
import { ShardStateProvider } from './shard.state.provider';
import { GridItemSize } from '../lazy.shards.grid/types';
import { ModalService } from '../../web/commons/modal/modal-commons/modal.service';
import { UserService } from '../../shared/user/user.service';
import getShardTypeLabel from './utils/getShardTypeLabel';

@Component({
    selector: 'wn-shard',
    styleUrls: [ './shard.component.scss' ],
    templateUrl: './shard.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ ShardStateProvider ]
})
export class ShardComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    /**
     * ------------------------------------------------------------------------
     * Input variables:
     * ------------------------------------------------------------------------
     */

    /**
     * The actual shard data.
     */
    @Input() data: Shard;

    /**
     * As the shard can have both a single or a double layout, this prop represent the
     * size of the shard, default it's single.
     * @type {string}
     */
    @Input() size: GridItemSize = 'single';

    /**
     * ------------------------------------------------------------------------
     * Local variables:
     * ------------------------------------------------------------------------
     */

    /**
     * A shortcut to the ShardType enum, it's actually used inside the template.
     * @type {ShardType}
     */
    public types = ShardType;

    /**
     * The Shard type
     */
    public type: ShardType;

    /**
     * The shard type label
     * NB: This variable it's actually used inside the template and can be replaced by using a
     * Pipe, but as it's actually only used here in the ShardComponent, I chose to use a normal
     * locale string instead of an Angular Pipe.
     */
    public typeLabel: string;

    /**
     * Class constructor
     * @param {ModalService} modalsProvider
     * @param {UserService} userProvider
     * @param {ShardStateProvider} shardStateProvider
     */
    constructor(private modalsProvider: ModalService,
                private userProvider: UserService,
                private shardStateProvider: ShardStateProvider) {
    }

    /**
     * On component init, select the type of the shard from the data
     */
    ngOnInit(): void {
        this.type = this.data.bit;
        this.typeLabel = getShardTypeLabel(this.type);
    }

    /**
     * Open shard details
     * FIXME: please use a proper routing system
     */
    public showDetails() {
        const shard: Shard = this.data;
        const user = this.userProvider.getUser();

        if (this.type !== ShardType.tour) {
            this.modalsProvider.openShardDetail(shard, user);
        } else {
            // FIXME: please, use a proper routing system
            const tourId = shard.id;

            location.href = (user.nid === shard.user.nid) ? `/#/tour/${tourId}/edit/plan` : `/#/tour/${tourId}/view`;
        }
    }

    /**
     * The ShardComponent use the ShardStateProvider to set and get the local
     * state from and to the sub-components
     */
    public closeAllPopOver() {
        this.shardStateProvider.setState({
            userPopOverOpen: false,
            placePopOverOpen: false
        });
    }
}
