import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StateService } from 'ui-router-ng2';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,
        private sessionService: SessionService,
        private userService: UserService,
        private stateService: StateService
    ) {
        //
    }

    signIn$(credentials: any): Observable<any> {
        const apiUrl = ConfigurationService.api.signIn;
        return this.http.post(apiUrl, credentials)
                        .flatMap((response) => {
                            return this.signInChain$(response.json());
                        });
    }

    // Also used by signUp
    signInChain$(responseData): Observable<any> {
        return Observable.of(responseData)
                         .flatMap((responseData) => {
                             return this.sessionService.sessionStart$(responseData);
                         })
                         .flatMap((userId) => {
                             return this.userService.loadUserFullData$(userId);
                         })
                         .flatMap((user: User) => {
                             return Observable.of(this.sessionService.setUser(user));
                         })
                         .flatMap(() => {
                             return Observable.of(this.sessionService.getToken());
                         });
    }

    signInViaFacebook$(userId: number, token: string): Observable<any> {
        const apiUrl = ConfigurationService.api.signInSocialFacebook;
        const requestBody = {
            facebookAccessToken: token,
            facebookId: userId
        };
        return this.http.post(apiUrl, requestBody)
                        .flatMap((response) => {
                            return this.signInChain$(response.json());
                        });
    };

    signOut() {
        this.sessionService.sessionDestroy();
    };

    isAuthenticated(): boolean {
        const result = this.sessionService.isValidSession();
        if (result === false) {
            this.sessionService.sessionDestroy();
        }

        return result;
    };

    private extractData(response: Response) {
        let body = response.json();
        return body || {};
    }
}
