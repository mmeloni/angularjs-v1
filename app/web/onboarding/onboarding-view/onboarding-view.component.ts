import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateService } from 'ui-router-ng2';

import { User } from '../../../shared/user/user.model';
import { UserService } from '../../../shared/user/user.service';
import { OnboardingStateService } from '../onboarding-state.service';
import { OnboardingStep } from '../onboarding-step.model';
import { STEPS_SETUP } from '../onboarding-steps';
import { OnboardingCardPlace } from './onboarding-setup/onboarding-card-place/onboarding-card-place.model';
import { OnboardingCardUser } from './onboarding-setup/onboarding-card-user/onboarding-card-user.model';

import * as _ from 'lodash';

@Component({
    styleUrls: [ 'onboarding-view.component.scss' ],
    templateUrl: 'onboarding-view.component.html'
})
export class OnboardingViewComponent implements OnInit, OnDestroy {
    @Input() translationResolved;
    @Input() placesResolved: any[];
    @Input() usersResolved: any[];
    @Input() viewMode: string;

    currentStep: any; // TODO: define 'OnboardingStep' type
    itemsToFollow: any[];
    inviteButtonText: string;
    translationNavbar: Object;
    translationSetup: Object;
    buttonOptions: Object;

    private translationSteps: Object;
    private defaultGoToNextImpl: Function = this.updateCurrentStep;
    private goToNextStepImpl: Function;
    private subscriptionStep: Subscription;
    private subscriptionItemsLeft: Subscription;
    private placesToFollow: Object[];
    private usersToFollow: Object[];

    private buttonOptionsEnabled = {
        cssClasses: 'btn-primary',
        isButtonDisabled: false,
        text: ''
    };

    private buttonOptionsDisabled = {
        cssClasses: 'btn-default',
        isButtonDisabled: true,
        text: ''
    };

    private itemType = 'place';

    constructor(private onboardingStateService: OnboardingStateService,
                private stateService: StateService,
                private userService: UserService) {
        //
    }

    ngOnInit() {
        this.buttonOptions = this.buttonOptionsEnabled;

        this.translationSteps = this.translationResolved.onboarding[ this.viewMode ].steps;
        this.translationNavbar = {
            of: this.translationResolved.of,
            step: this.translationResolved.step
        };

        // Add every i18n string needed by the components under the setup component
        this.translationSetup = {
            follow: this.translationResolved.follow,
            followers: this.translationResolved.followers,
            inviteFromFacebook: this.translationResolved.onboarding.inviteFromFacebook,
            likes: this.translationResolved.likes,
            place: this.translationResolved.place,
            planned: this.translationResolved.planned,
            unfollow: this.translationResolved.unfollow
        };

        this.onboardingStateService.init('STEPS_' + this.viewMode.toUpperCase());
        this.onboardingStateService.resetCurrentStep();

        if (this.isSetupViewMode()) {
            const itemsPerRow = 4;
            this.populateArrays(itemsPerRow);
        }

        this.subscriptionStep = this.onboardingStateService.currentStepUpdated$.subscribe((currentStep: OnboardingStep) => {
            this.currentStep = this.translate(currentStep);
            this.buttonOptionsEnabled.text = this.currentStep.next.text;

            if (this.isSetupViewMode()) {
                if (!this.isLastStepSetup(currentStep.index)) {
                    this.onboardingStateService.resetItemsToFollowLeft();
                }
                this.itemsToFollow = this.triageItemsToFollow(currentStep.index);
            }

            if (currentStep.next.state !== undefined) {
                this.goToNextStepImpl = this.goToState;
            } else {
                this.goToNextStepImpl = this.defaultGoToNextImpl;
            }
        });

        if (this.isSetupViewMode()) {
            this.subscriptionItemsLeft = this.onboardingStateService.itemsToFollowLeft$.subscribe((itemsToFollowLeft) => {
                this.updateButton(itemsToFollowLeft);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscriptionStep !== undefined) {
            this.subscriptionStep.unsubscribe();
        }

        if (this.subscriptionItemsLeft !== undefined) {
            this.subscriptionItemsLeft.unsubscribe();
        }
    }

    goToNextStep() {
        this.goToNextStepImpl();
    }

    private isLastStepSetup(index: number): boolean {
        if (index === undefined) {
            return false;
        } else {
            return index === STEPS_SETUP.length - 1;
        }
    }

    private isSetupViewMode(): boolean {
        return this.viewMode === 'setup';
    }

    private populateArrays(itemsPerArray: number) {
        this.placesToFollow = _.chunk(this.mapPlacesResolved(), itemsPerArray);
        this.usersToFollow = _.chunk(this.mapUsersResolved(), itemsPerArray);
    }

    private mapPlacesResolved(): OnboardingCardPlace[] {
        return _.map(this.placesResolved, (item) => {
            const newItem: OnboardingCardPlace = {
                countFollower: item.followNumber,
                countLike: item.likeNumber,
                countPlan: item.planCount,
                iconClasses: 'wn-icon wn-icon-place wn-icon-place-color wn-icon-circle wn-icon-pin',
                id: item.id,
                isFollowed: item.isFollowed,
                title: item.title
            };
            return newItem;
        });
    }

    private mapUsersResolved(): OnboardingCardUser[] {
        return _.map(this.usersResolved, (item) => {
            const newItem: OnboardingCardUser = {
                avatar: item.avatar,
                fullName: [ item.firstname, item.lastname ].join(' '),
                id: item.nid,
                isFollowed: item.isFollowed,
                username: item.username
            };
            return newItem;
        });
    }

    private triageItemsToFollow(stepIndex: number): Object[] {
        let itemsToFollow: Object[];

        switch (stepIndex) {
            case 0:
                itemsToFollow = _.cloneDeep(this.placesToFollow);
                break;
            case 1:
                itemsToFollow = _.cloneDeep(this.usersToFollow);
                this.itemType = 'user';
                break;
            default:
                itemsToFollow = [];
                break;
        }

        return itemsToFollow;
    }

    private goToState(state: string) {
        const toStateName = this.currentStep.next.state;

        if (toStateName === 'stream') {
            let user: User = this.userService.setOnboardingWelcomeDone();

            this.userService.updateUserData(user).then((response) => {
                user = this.userService.deserialize(response);
                this.userService.setUser(user);
            });
        }

        this.stateService.go(toStateName);
    }

    private updateCurrentStep() {
        this.onboardingStateService.updateCurrentStep();
    }

    private translate(step: OnboardingStep) {
        const t = this.translationSteps[ step.index ];

        step.title = t.title;
        step.text = t.text;
        step.next.text = t.next;

        return step;
    }

    private updateButton(itemsToFollowLeft: number) {
        if (itemsToFollowLeft <= 0) {
            this.buttonOptions = this.buttonOptionsEnabled;
        } else {
            this.buttonOptionsDisabled.text = [ this.translationResolved.onboarding.setup.itemsLeft[ this.itemType ], itemsToFollowLeft ].join(': ');
            this.buttonOptions = this.buttonOptionsDisabled;
        }
    }
}
