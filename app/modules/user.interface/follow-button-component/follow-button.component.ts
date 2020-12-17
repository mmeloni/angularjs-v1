import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperFollowService } from './helper-follow.service';
import { FollowService } from '../../../shared/follow/follow.service';

type ButtonSize = 'xs' | 'sm' | 'lg';

/*
    Usage:
    <wn-follow-button
        [targetId]="componentData.id"
        [isTargetFollowed]="componentData.isFollowed"
        [translation]="translationFollowButton"
    ></wn-follow-button>

    The button will fake update itself, then settle to the correct state depending of the actual follow action.
    Use (toggledFollow) only when you need to perform some additional tasks outside of the component.
*/

// FIXME: please plan a better rewrite of this component.

@Component({
    selector: 'wn-follow-button',
    templateUrl: './follow-button.component.html'
})
export class FollowButtonComponent implements OnInit {
    @Input() targetId: number;
    @Input() isTargetFollowed: boolean = false;
    @Input() translation: any;
    @Input() buttonSize?: ButtonSize;

    @Output() toggledFollow = new EventEmitter<boolean>();

    buttonOptions = {
        cssClasses: '',
        isLoading: false,
        text: ''
    };

    private followText: string = '';
    private unfollowText: string = '';

    constructor(private followService: FollowService) {
        //
    }

    ngOnInit() {
        // set initial state
        this.followText = this.translation.follow;
        this.unfollowText = this.translation.unfollow;
        this.buttonOptions = HelperFollowService.toggleSetButton(this.isTargetFollowed, this.followText, this.unfollowText);
        if (this.buttonSize === 'lg') {
            this.buttonOptions.cssClasses += ' btn-block';
        }
    }

    toggleFollow(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        // faking it for a snappier UX
        this.updateByIsFollowed();

        this.buttonOptions.isLoading = true;

        // actually doing it
        this.followService.toggleFollow(this.targetId, !this.isTargetFollowed).then(() => {
            // TODO: log response
            this.buttonOptions.isLoading = false;
        }).catch((error) => {
            // rollback because we faked it in advance
            this.updateByIsFollowed();
            // TODO: log error
        });
    }

    private updateByIsFollowed() {
        this.isTargetFollowed = !this.isTargetFollowed;
        this.buttonOptions = HelperFollowService.toggleSetButton(this.isTargetFollowed, this.followText, this.unfollowText);
        if (this.buttonSize === 'lg') {
            this.buttonOptions.cssClasses += ' btn-block';
        }

        this.toggledFollow.next(this.isTargetFollowed);
    }
}
