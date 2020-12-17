import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FacebookService } from '../../../../shared/social/facebook.service';
import { OnboardingStateService } from '../../onboarding-state.service';

@Component({
    selector: 'wn-onboarding-setup',
    styleUrls: ['onboarding-setup.component.scss'],
    templateUrl: 'onboarding-setup.component.html'
})
export class OnboardingSetupComponent implements OnDestroy, OnInit {
    @Input() itemsToFollow: Object[];
    @Input() translation: any;

    currentStepNumber: number;
    translationCardPlace: Object;
    translationCardUser: Object;

    private subscription: Subscription;

    constructor(
        public facebookService: FacebookService,
        private onboardingStateService: OnboardingStateService
    ) {
        //
    }

    ngOnInit() {
        this.facebookService.init();

        this.translationCardPlace = {
            follow: this.translation.follow,
            followers: this.translation.followers,
            likes: this.translation.likes,
            place: this.translation.place,
            planned: this.translation.planned,
            unfollow: this.translation.unfollow
        };

        this.translationCardUser = {
            follow: this.translation.follow,
            unfollow: this.translation.unfollow
        };

        this.subscription = this.onboardingStateService.currentStepIndexChanged$.subscribe((currentStepIndex) => {
            this.currentStepNumber = ++currentStepIndex; // good old "array index vs human readable"
        });
    }

    ngOnDestroy() {
        if (this.subscription !== undefined ) {
            this.subscription.unsubscribe();
        }
    }

    inviteFriends() {
        this.facebookService.inviteFriends();
    }
}
