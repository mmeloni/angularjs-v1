import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Network } from '../../providers/network';
import { User } from '../../shared/user/user.model';

@Component({
    selector: 'wn-stream',
    styleUrls: [ './stream.page.component.scss' ],
    template: `
        <wn-navbar-social [labels]="translationResolved"></wn-navbar-social>
        <div class="stream-page" *ngIf="user && user.id && user.nid">
            <wn-lazy-shards-grid [translations]="translationResolved" [user]="user">
            </wn-lazy-shards-grid>
        </div>
    `
})
export class StreamPageComponent implements OnInit {

    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translationResolved;

    public user: User;

    constructor(private userProvider: UserService) {
    }

    ngOnInit() {
        const token: string = localStorage.getItem('token');

        // FIXME: the following instruction should be executed after application start
        Network.setAuthToken(token);

        const user = this.userProvider.getUser();

        if (!token || !user.id || !user.nid) {
            // FIXME: try to use the standard Angular Router
            window.location.href = '/'; // ngRouter is not fucking working.
        } else {
            this.user = user;
        }
    }
}
