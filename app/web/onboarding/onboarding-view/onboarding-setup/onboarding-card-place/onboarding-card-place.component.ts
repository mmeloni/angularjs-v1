import { Component, Input, OnInit } from '@angular/core';

import { OnboardingStateService } from '../../../onboarding-state.service';
import { OnboardingCardPlace } from './onboarding-card-place.model';
import { ActionBarItem } from '../../../../../modules/user.interface/action-bar/action-bar-item/action-bar-item.model';

@Component({
    selector: 'wn-onboarding-card-place',
    styleUrls: ['onboarding-card-place.component.scss'],
    templateUrl: 'onboarding-card-place.component.html'
})
export class OnboardingCardPlaceComponent implements OnInit {
    @Input() place: OnboardingCardPlace;
    @Input() translation: any;

    buttonOptions: Object;
    statisticsItems: ActionBarItem[];
    translationFollowButton: any;

    constructor(
        private onboardingStateService: OnboardingStateService
    ) {
        //
    }

    ngOnInit() {
        this.translationFollowButton = {
            follow: [this.translation.follow, this.translation.place].join(' '),
            unfollow: [this.translation.unfollow, this.translation.place].join(' ')
        };

        if (this.place.isFollowed === true) {
            this.onboardingStateService.updateItemsToFollowLeft(this.place.isFollowed);
        }

        this.statisticsItems = [
            {
                label: this.translation.followers,
                value: this.place.countFollower
            },
            {
                label: this.translation.planned,
                value: this.place.countPlan
            },
            {
                label: this.translation.likes,
                value: this.place.countLike
            }
        ];
    }

    updateByIsFollowed(isFollowed: boolean) {
        this.place.isFollowed = isFollowed;
        this.onboardingStateService.updateItemsToFollowLeft(this.place.isFollowed);
        this.statisticsItems[0].value += (this.place.isFollowed === true) ? 1 : -1;
    }
}
