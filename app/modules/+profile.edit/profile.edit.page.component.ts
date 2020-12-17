import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Network } from '../../providers/network';
import { User } from '../../shared/user/user.model';
import { StateService } from 'ui-router-ng2';

@Component({
    selector: 'wn-profile-edit',
    styleUrls: [ 'profile.edit.page.component.scss' ],
    templateUrl: 'profile.edit.page.component.html'
})
export class ProfileEditPageComponent implements OnInit {

    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translationResolved;
    @Input() translatedCountriesResolved;

    public user: User;

    // FIXME: please update to the latest Angular version so we can stop using UI-bloody-Router */
    constructor(private userService: UserService,
                private routesService: StateService) {
    }

    ngOnInit() {
        const token: string = localStorage.getItem('token');

        // FIXME: the following instruction should be executed after application start
        Network.setAuthToken(token);

        this.user = this.userService.getUser();

        if (!this.user || !this.user.id || !this.user.nid || !token) {
            this.redirectToHome();
        }
    }

    public goBack() {
        // FIXME: please use the standard Angular Router
        this.routesService.go('profileById', { userNid: this.user.nid });
    }

    private redirectToHome() {
        // FIXME: please use the standard Angular Router
        this.routesService.go('home');
    }
}
