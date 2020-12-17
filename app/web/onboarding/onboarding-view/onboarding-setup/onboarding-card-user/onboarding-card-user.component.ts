import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { OnboardingCardUser } from './onboarding-card-user.model';

@Component({
    selector: 'wn-onboarding-card-user',
    styleUrls: [ 'onboarding-card-user.component.scss' ],
    templateUrl: 'onboarding-card-user.component.html'
})
export class OnboardingCardUserComponent implements OnInit {
    @Input() user: OnboardingCardUser;
    @Input() translation: any;

    buttonOptions: Object;
    coverImageOptions: ImageServiceOptions;
    translationFollowButton: any;

    constructor(private onboardingStateService: OnboardingStateService) {
        //
    }

    ngOnInit() {
        this.translationFollowButton = {
            follow: [ this.translation.follow, this.translation.user ].join(' '),
            unfollow: [ this.translation.unfollow, this.translation.user ].join(' ')
        };

        if (this.user.isFollowed === true) {
            this.onboardingStateService.updateItemsToFollowLeft(this.user.isFollowed);
        }

        this.coverImageOptions = {
            default: ConfigurationService.defaultImages.shard,
            format: 'cover',
            id: this.user.id,
            type: 'user'
        };
    }

    updateByIsFollowed(isFollowed: boolean) {
        this.user.isFollowed = isFollowed;
        this.onboardingStateService.updateItemsToFollowLeft(this.user.isFollowed);
    }
}
