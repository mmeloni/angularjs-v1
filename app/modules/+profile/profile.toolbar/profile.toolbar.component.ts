import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../../shared/user/user.model';
import { ProfileStateProvider } from '../profile.state.provider';
import { ProfileTabType } from '../types';
import { StateService } from 'ui-router-ng2';
import { UserService } from '../../../shared/user/user.service';

@Component({
    selector: 'wn-profile-toolbar',
    styleUrls: [ 'profile.toolbar.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './profile.toolbar.component.html'
})
export class ProfileToolbarComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;

    @Input() user: User;

    public showEdit: boolean = false;
    public shardsCount: number = 0;
    public boardsCount: number = 0;
    public toursCount: number = 0;
    public followersCount: number = 0;
    public followingCount: number = 0;

    constructor(private stateProvider: ProfileStateProvider,
                private routesService: StateService,
                private userService: UserService) {
    }

    ngOnInit() {
        const currentUser = this.userService.getUser();

        if (this.user.id === currentUser.id) {
            this.showEdit = true;
        }

        this.stateProvider.getState().subscribe(({ variables }) => {
            this.shardsCount = variables.shards;
            this.boardsCount = variables.boards;
            this.toursCount = variables.tours;
            this.followersCount = variables.followers;
            this.followingCount = variables.following;
        });
    }

    public showProfileContent(tabType: ProfileTabType) {
        this.stateProvider.setState({
            currentTab: tabType
        });

        if (this.user) {
            this.routesService.go('profileByView', {
                userNid: this.user.nid,
                viewType: tabType
            });
        }
    }

    public handleSelectChange($event) {
        const tabType: ProfileTabType = ($event.target || $event.srcElement).value;
        this.showProfileContent(tabType);
    }

    public goToProfileEdit() {
        const currentUser = this.userService.getUser();

        // this is actually a redundant check but I prefer not to take the risk
        if (this.user.id === currentUser.id) {
            this.routesService.go('profileEdit');
        }
    }
}
