import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'ui-router-ng2';

import { ConfigurationService } from '../../../../../shared/config/configuration.service';

/*
Usage:
<wn-linked-place-info
    [bit]="shard.bit"
    [placeId]="shard.place.id"
    [label]="shard.nearestPoi.name"
    cssClasses="text-capitalize"
></wn-linked-place-info>
*/

@Component({
    selector: 'wn-linked-place-info',
    templateUrl: 'linked-place-info.component.html'
})
export class LinkedPlaceInfoComponent implements OnInit {
    @Input() bit: number;
    @Input() placeId: number;
    @Input() label: string;
    @Input() cssClasses?: string;

    iconClasses: string;
    labelClasses: string;

    constructor(
        private stateService: StateService,
        private ngbActiveModal: NgbActiveModal
    ) {
        //
    }

    ngOnInit() {
        const shardIconSuffix = ConfigurationService.linkedPlaceType[this.bit];
        this.iconClasses = `wn-icon wn-icon-${shardIconSuffix} wn-icon-${shardIconSuffix}-color`;
        this.labelClasses = `text-${shardIconSuffix}`;
        this.labelClasses = ['cursor-pointer', this.labelClasses].join(' ');
    }

    goToLinkedPlace(placeId) {
        switch (this.bit) {
            case ConfigurationService.shardsBitMask.stage:
                this.ngbActiveModal.close();
                this.stateService.go('place', { placeId: placeId });
                break;
            case ConfigurationService.shardsBitMask.attraction:
                this.ngbActiveModal.close();
                this.stateService.go('attraction', { placeId: placeId });
                break;
            case ConfigurationService.shardsBitMask.hotel:
                this.ngbActiveModal.close();
                this.stateService.go('hotel', { hotelId: placeId });
                break;
            default:
                break;
        }
    };
}
