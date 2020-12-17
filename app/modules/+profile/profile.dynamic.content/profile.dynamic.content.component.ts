import { isEmpty } from 'lodash';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../../shared/user/user.model';
import { ProfileStateProvider } from '../profile.state.provider';
import { ProfileState, ProfileTabType, Streams } from '../types';
import { ModalService } from '../../../web/commons/modal/modal-commons/modal.service';
import { UserService } from '../../../shared/user/user.service';

@Component({
    selector: 'wn-profile-dynamic-content',
    styleUrls: [ 'profile.dynamic.content.component.scss' ],
    templateUrl: 'profile.dynamic.content.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProfileDynamicContentComponent implements OnInit, OnChanges {
    /* FIXME: please, find a better way to translate the application and remove this disgusting property */
    @Input() translations;

    @Input() user: User;
    @Input() tab: ProfileTabType;

    public currentStream: Streams = Streams.stages;
    public streamTypes = Streams;
    public contentIsEmpty: boolean = false;
    public currentUser: User;
    public isCurrentUserProfile: boolean = false;

    constructor(private stateProvider: ProfileStateProvider,
                private userService: UserService,
                private modals: ModalService) {
    }

    ngOnInit(): void {
        this.currentUser = this.userService.getUser();

        if (this.currentUser.id === this.user.id) {
            this.isCurrentUserProfile = true;
        }
    }

    ngOnChanges(params) {
        const currentTab = params.tab ? params.tab.currentValue : null;

        if (currentTab) {
            this.contentIsEmpty = false;

            switch (currentTab) {
                default:
                case 'stages':
                    this.currentStream = Streams.stages;
                    break;
                case 'boards':
                    this.currentStream = Streams.boards;
                    break;
                case 'tours':
                    this.currentStream = Streams.tours;
                    break;
                case 'followers':
                    this.currentStream = Streams.followed;
                    break;
                case 'following':
                    this.currentStream = Streams.following;
                    break;
            }
        }
    }

    public onGridFetchResponse({ response, page }) {
        if (isEmpty(response) && page === 1) {
            this.contentIsEmpty = true;
        }

        if (!isEmpty(response)) {
            const state: Partial<ProfileState> = {
                variables: {
                    [ this.tab ]: response.length
                }
            };

            this.stateProvider.setState(state);
        }
    }

    public onFollowButtonToggle({ listLength, isFollowed }) {
        const state: Partial<ProfileState> = {
            variables: {
                [ this.tab ]: isFollowed ? listLength : listLength - 1
            }
        };

        this.stateProvider.setState(state);
    }

    public addNewContent() {
        this.modals.openShardNew();
    }
}
