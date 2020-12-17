import { Component, Input, OnInit } from '@angular/core';
import { ShardStateProvider } from '../shard.state.provider';
import { IPlace, ShardState, ShardType } from '../types';
import getShardIconName from '../utils/getShardIconName';

@Component({
    selector: 'wn-shard-place-details',
    styleUrls: [ './shard.place.details.component.scss' ],
    templateUrl: './shard.place.details.component.html'
})
export class ShardPlaceDetailsComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    /**
     * the 'type' input is needed to understand if the shard represent a tour or not
     * details on how this flag is used into the .html template
     * @type {ShardType}
     */
    @Input() type: ShardType;

    /**
     * the 'place' input is needed to show the place information into the popover
     * @type {IPlace}
     */
    @Input() place: IPlace;

    /**
     * a shortcut to the ShardType enum to be used into the template
     * @type {ShardType}
     */
    public types = ShardType;

    /**
     * a local flag on popover state
     * @type {boolean}
     */
    public canShowPopover: boolean = false;

    /**
     * this string represent a the glyph icon type passed as string to the wn-icon component
     * @type {string}
     */
    public iconGlyph: string;

    constructor(private shardStateProvider: ShardStateProvider) {
    }

    ngOnInit(): void {
        // a standard Angular Pipe can be used to avoid the import of the following method
        // on the other hand, a simple arrow function could improve performance
        this.iconGlyph = getShardIconName(this.type);

        if (this.type !== ShardType.tour) {
            this.shardStateProvider.getState().subscribe((state: ShardState) => {
                if (!state.placePopOverOpen) {
                    this.canShowPopover = false;
                }
            });
        }
    }

    /**
     * show the popover component
     */
    public showPopover() {
        this.shardStateProvider.setState({ userPopOverOpen: false });
        this.canShowPopover = true;
    }
}
