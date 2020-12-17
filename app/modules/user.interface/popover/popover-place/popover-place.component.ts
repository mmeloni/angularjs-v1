import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StateService } from 'ui-router-ng2';
import { ActionBarItem } from '../../action-bar/action-bar-item/action-bar-item.model';
import { PlaceService } from '../../../../shared/place/place.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';

@Component({
    selector: 'wn-popover-place',
    styleUrls: ['./popover-place.component.scss'],
    templateUrl: './popover-place.component.html'
})
export class PopoverPlaceComponent implements OnDestroy, OnInit {
    @Input() componentData: any;
    @Input() labels: any;

    iconGlyph: string = '';
    translationFollowButton: any = {
        follow: '',
        unfollow: ''
    };
    statisticsItems: ActionBarItem[];
    // empty object for latency compensation
    target: any = {};
    isTargetPlaceLoaded: boolean = false;

    private subscription: Subscription;

    constructor(
        private stateService: StateService,
        private placeService: PlaceService
    ) {
        //
    }

    ngOnInit() {
        this.triageTargetBit();

        this.statisticsItems = [
            {
                label: this.labels.followers,
                value: 0
            },
            {
                label: this.labels.planned,
                value: 0
            },
            {
                label: this.labels.likes,
                value: 0
            }
        ];

        this.subscription = this.placeService.loadPlaceFullData$(this.componentData.id)
                .subscribe((response) => {
                    this.target = response;

                    // must refer to full target loaded
                    this.statisticsItems = [
                        {
                            label: this.labels.followers,
                            value: this.target.followNumber
                        },
                        {
                            label: this.labels.planned,
                            value: this.target.planCount
                        },
                        {
                            label: this.labels.likes,
                            value: this.target.likeNumber
                        }
                    ];

                    this.isTargetPlaceLoaded = true;
                });
    }

    private triageTargetBit() {
        switch (this.componentData.bit) {
            case ConfigurationService.shardsBitMask.placeHotel:
                this.iconGlyph = `hotel`;
                this.translationFollowButton = {
                    follow: [this.labels.follow, this.labels.hotel].join(' '),
                    unfollow: [this.labels.unfollow, this.labels.hotel].join(' ')
                };
                break;
            case ConfigurationService.shardsBitMask.place:
                this.iconGlyph = `place`;
                this.translationFollowButton = {
                    follow: [this.labels.follow, this.labels.place].join(' '),
                    unfollow: [this.labels.unfollow, this.labels.place].join(' ')
                };
                break;
            case ConfigurationService.shardsBitMask.placeAttraction:
                this.iconGlyph = `attraction`;
                this.translationFollowButton = {
                    follow: [this.labels.follow, this.labels.attraction].join(' '),
                    unfollow: [this.labels.unfollow, this.labels.attraction].join(' ')
                };
                break;
            default:
                break;
        }
    }

    goToLinkedPlace() {
        switch (this.componentData.bit) {
            case ConfigurationService.shardsBitMask.placeHotel:
                this.stateService.go('hotel', { hotelId: this.componentData.id });
                break;
            case ConfigurationService.shardsBitMask.place:
                this.stateService.go('place', { placeId: this.componentData.id });
                break;
            case ConfigurationService.shardsBitMask.placeAttraction:
                this.stateService.go('attraction', { placeId: this.componentData.id });
                break;
            default:
                break;
        }
    };

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}
