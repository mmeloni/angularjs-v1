import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StateService } from 'ui-router-ng2';
import { ActionBarItem } from '../../action-bar/action-bar-item/action-bar-item.model';
import { User } from '../../../../shared/user/user.model';
import { UserService } from '../../../../shared/user/user.service';

@Component({
    selector: 'wn-popover-user',
    styleUrls: [ './popover-user.component.scss' ],
    templateUrl: './popover-user.component.html'
})
export class PopoverUserComponent implements OnDestroy, OnInit {
    @Input() componentData: any;
    @Input() labels: any;

    actor: User;
    // empty object for latency compensation
    target: any = {};
    translationFollowButton: any = {
        follow: '',
        unfollow: ''
    };
    statisticsItems: ActionBarItem[];
    isTargetUserLoaded: boolean = false;

    private subscription: Subscription;

    constructor(private stateService: StateService,
                private userService: UserService) {
        //
    }

    ngOnInit() {
        this.actor = this.userService.getUser();

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

        this.translationFollowButton = {
            follow: this.labels.follow,
            unfollow: this.labels.unfollow
        };

        this.subscription = this.userService.loadUserFullData$(this.componentData.nid)
            .subscribe((response) => {
                this.target = response;

                // must refer to full target loaded
                this.statisticsItems = [
                    {
                        label: this.labels.shards,
                        value: this.target.shardsCount
                    },
                    {
                        label: this.labels.following,
                        value: this.target.followingCount
                    },
                    {
                        label: this.labels.followers,
                        value: this.target.followersCount
                    }
                ];

                this.isTargetUserLoaded = true;
            });
    }

    goToProfilePage() {
        // this.stateService.go('profile.view', { userId: this.componentData.nid });
        const userNid = this.componentData.nid;
        this.stateService.go('profileById', { userNid });
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}
