import { Component, Input, OnInit } from '@angular/core';
import { HelperLikeService } from './helper-like.service';
import { LikesProvider } from '../../../providers/likes.provider/likes.provider';

/*
    Usage:
    <wn-like-button
        [cssClasses]="['btn', 'btn-default']"
        [targetId]="componentData.id"
        [userId]="currentUserNid"
        [isTargetLiked]="componentData.likeUser"
    ></wn-like-button>
*/

@Component({
    selector: 'wn-like-button',
    templateUrl: './like-button.component.html'
})
export class LikeButtonComponent implements OnInit {
    @Input() targetId: number;
    @Input() userId: number;
    @Input() isTargetLiked: boolean;
    @Input() cssClasses: string;

    buttonOptions = {
        iconClasses: '',
        isLoading: false
    };

    constructor(private likeService: LikesProvider) {
        //
    }

    ngOnInit() {
        // set initial state
        this.buttonOptions = HelperLikeService.toggleSetButton(this.isTargetLiked);
    }

    toggleLike() {
        // faking it for a snappier UX
        this.updateByIsLiked();

        this.buttonOptions.isLoading = true;

        // actually doing it
        this.likeService.toggleLike(this.targetId)
            .toPromise()
            .then((body) => {
                if (typeof body === 'string') {
                    if (body === 'like_added') {
                        return true;
                    }

                    if (body === 'like_deleted') {
                        return false;
                    }
                }
                return body || {};
            })
            .then((response) => {
                // TODO: log response
                this.buttonOptions.isLoading = false;
                if (response === 'like_added') {
                    HelperLikeService.setButtonToLike();
                } else {
                    HelperLikeService.setButtonToUnlike();
                }
            }).catch((error) => {
            // rollback because we faked it in advance
            this.updateByIsLiked();
            this.buttonOptions.isLoading = false;
            // TODO: log error
        });
    }

    private updateByIsLiked() {
        this.isTargetLiked = !this.isTargetLiked;
        this.buttonOptions = HelperLikeService.toggleSetButton(this.isTargetLiked);
    }
}
