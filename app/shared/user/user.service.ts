// FIXME: not documented provider.
// FIXME: useless and pointless use of promises all around.
// FIXME: USER SHOULD BE AN OBSERVABLE!
// FIXME: Rewrite the whole thing.

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'angular2-jwt';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { UploadService } from '../upload/upload.service';
import { User } from './user.model';

@Injectable()
export class UserService {

    constructor(private http: Http,
                private authHttp: AuthHttp,
                private sessionService: SessionService,
                private uploadService: UploadService) {
        //
    }

    createUser$(registrationData: any): Observable<any> {
        return this.http.post(ConfigurationService.api._SUBSCRIBE, registrationData)
            .map(this.extractData);
    }

    tbTrackingCall$(nid): Observable<any> {
        const apiUrl = ConfigurationService.api.tbEndPoint
            .replace(':leadNumber', nid.toString());
        return this.http.get(apiUrl)
            .map(this.extractData)
            .catch(() => {
                return Observable.of({});
            });
    }

    loadUserFullData(nid: number): Promise<User> {
        const apiUrl = ConfigurationService.api._LOAD_USER_FULL_DATA
            .replace(':userId', nid.toString());
        return this.http.get(apiUrl, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    loadUserFullData$(nid: number): Observable<User> {
        const apiUrl = ConfigurationService.api._LOAD_USER_FULL_DATA.replace(':userId', nid.toString());

        return this.authHttp.get(apiUrl).map((response) => response.json());
    }

    loadUserBaseData(nid: number): Promise<User> {
        const apiUrl = ConfigurationService.api._LOAD_USER_BASE_DATA
            .replace(':userId', nid.toString());
        return this.http.get(apiUrl, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    updateUserData(user: User): Promise<User> {
        return this.http.post(ConfigurationService.api._EDIT_PROFILE, user, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    recoverPassword$(usernameOrEmail: string): Observable<User> {
        return this.http.post(ConfigurationService.api.passwordResetSendEmail, { user: usernameOrEmail })
            .map(this.extractData);
    }

    changePassword$(nid: number, code: string, password: string): Observable<any> {
        const params = { nid: nid, code: code, password: password };
        return this.http.post(ConfigurationService.api.passwordReset, params)
            .map(this.extractData);
    }

    uploadAvatar(base64FileString: string): Promise<any> {
        return this.http.post(ConfigurationService.api._UPLOAD_AVATAR, { base64FileString: base64FileString }, this.getOptions())
            .toPromise()
            .then(function (response) {
                return response.json();
            });
    }

    uploadCover(file: File, userId: number): Promise<any> {
        const filename = 'full_user_' + userId + '.' + 'jpg';

        return this.uploadService.uploadContent(file, 'user', filename);
    }

    blockUser(targetId: number): Promise<any> {
        let params = { blockedUserId: targetId };
        return this.http.post(ConfigurationService.api._BLOCK_USER, params, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    unblockUser(targetId: number): Promise<any> {
        let params = { blockedUserId: targetId };
        return this.http.post(ConfigurationService.api._UNBLOCK_USER, params, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    getUserFollowing(nid: number, page: number, elementsPerPage: number): Promise<any> {
        let params = { nid: nid, page: page, elements: elementsPerPage };
        return this.http.post(ConfigurationService.api._FOLLOWING_PROFILE, params, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    getUserFollowing$(nid: number, page: number = 1, elementsPerPage: number = 20): Observable<any> {
        let params = { nid: nid, page: page, elements: elementsPerPage };
        return this.http.post(ConfigurationService.api._FOLLOWING_PROFILE, params, this.getOptions())
            .map(this.extractData);
    }

    getUserFollowers(nid: number, page: number, elementsPerPage: number): Promise<any> {
        let params = { nid: nid, page: page, elements: elementsPerPage };
        return this.http.post(ConfigurationService.api._FOLLOWED_PROFILE, params, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    getUserFollowers$(nid: number, page: number = 1, elementsPerPage: number = 20): Observable<any> {
        let params = { nid: nid, page: page, elements: elementsPerPage };
        return this.http.post(ConfigurationService.api._FOLLOWED_PROFILE, params, this.getOptions())
            .map(this.extractData);
    }

    getPopularProfiles(): Promise<any> {
        return this.http.get(ConfigurationService.api._ONBOARDING_SUGGESTED_USERS, this.getOptions())
            .toPromise()
            .then(this.extractData);
    }

    getUser(): User {
        return this.deserialize(this.sessionService.getUser());
    }

    setUser(user: User): any {
        this.sessionService.setUser(user);
    }

    deserialize(json: any): User {
        // no JSON.parse because not really JSON
        return Object.assign(new User(), json);
    }

    hasOnboardingWelcomeDone(): boolean {
        const actionWelcomeBitMask = this.getUser().onboardingActionsBitMask;

        return actionWelcomeBitMask === this.getCheckActionWelcomeBitMask();
    }

    setOnboardingWelcomeDone(): User {
        let user: User = this.getUser();
        user.onboardingActionsBitMask = this.getCheckActionWelcomeBitMask();
        this.setUser(user);

        return this.getUser();
    }

    hasOnboardingPlanDone(): any {
        const actionPlanBitMask = this.getUser().onboardingActionsBitMask;

        return actionPlanBitMask === this.getCheckActionPlanBitMask();
    }

    setOnboardingPlanDone(): User {
        let user: User = this.getUser();
        user.onboardingActionsBitMask = this.getCheckActionPlanBitMask();
        this.setUser(user);

        return this.getUser();
    }

    private getCheckActionWelcomeBitMask(): number {
        const actionWelcomeBitMask = this.getUser().onboardingActionsBitMask;

        return actionWelcomeBitMask | ConfigurationService.onboardingActionsBitMask.welcome;
    }

    private getCheckActionPlanBitMask(): number {
        const actionPlanBitMask = this.getUser().onboardingActionsBitMask;

        return actionPlanBitMask | ConfigurationService.onboardingActionsBitMask.planStage;
    }

    private extractData(response: Response): any {
        let body = {};

        if (response.text() !== '') {
            body = response.json();
        }

        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        return body;
    }

    private getOptions(): RequestOptions {
        let headers: Headers = new Headers({
            Authorization: 'Bearer ' + this.sessionService.getToken()
        });

        let options = new RequestOptions({ headers: headers });
        options.headers = headers; // TODO: is this line redundant?

        return options;
    }
}
