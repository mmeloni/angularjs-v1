import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Network } from '../../providers/network';
import { User } from '../../shared/user/user.model';
import { ProfileStateProvider } from './profile.state.provider';
import { UIRouter } from 'ui-router-ng2/router';
import { ProfileTabType } from './types';
import { StateService } from 'ui-router-ng2';

@Component({
    selector: 'wn-profile',
    styleUrls: [ 'profile.page.component.scss' ],
    templateUrl: 'profile.page.component.html',
    providers: [ ProfileStateProvider ]
})
export class ProfilePageComponent implements OnInit {

    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translationResolved;

    public user: User;
    public tab: ProfileTabType = 'stages';
    public isCurrentUserProfile: boolean = false;

    // FIXME: please update to the latest Angular version so we can stop using UI-bloody-Router */
    constructor(private userService: UserService,
                private uiRouter: UIRouter,
                private routesService: StateService,
                private stateProvider: ProfileStateProvider) {
    }

    ngOnInit() {
        const userNidParam: number = +this.uiRouter.globals.params.userNid;
        const currentTab: ProfileTabType = this.uiRouter.globals.params.viewType || this.tab;
        const token: string = localStorage.getItem('token');

        // FIXME: the following instruction should be executed after application start
        Network.setAuthToken(token);

        const currentUser = this.userService.getUser();

        if (!token || !currentUser || !currentUser.nid || !currentUser.id) {
            this.redirectToHome();
        } else {
            if (!userNidParam || currentUser.nid === userNidParam) {
                this.user = currentUser;
                this.isCurrentUserProfile = true;
                this.onUserReceive(currentTab);
            } else {
                this.userService.loadUserFullData$(userNidParam).subscribe((user) => {
                        this.user = user;
                        this.isCurrentUserProfile = false;
                        this.onUserReceive(currentTab);
                    },
                    () => {
                        this.redirectToHome();
                    });
            }
        }

    }

    private onUserReceive(currentTab) {

        const variables = {
            shards: this.user.shardsCount,
            boards: this.user.boardsCount,
            tours: this.user.toursCount,
            followers: this.user.followersCount,
            following: this.user.followingCount
        };

        this.stateProvider.setState({ currentTab, variables });
        this.stateProvider.getState().subscribe(({ currentTab }) => {
            this.tab = currentTab;
        });
    }

    private redirectToHome() {
        // FIXME: please use the standard Angular Router
        this.routesService.go('home');
    }
}
