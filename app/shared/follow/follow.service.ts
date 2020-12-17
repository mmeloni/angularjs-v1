import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class FollowService {

    constructor(
        private http: Http,
        private sessionService: SessionService
    ) {
        //
    }

    toggleFollow(targetId: number, isTargetFollowed: boolean): Promise<boolean> {
        if (isTargetFollowed === true) {
            return this.unfollow(targetId).then(() => {
                return false;
            });
        } else {
            return this.follow(targetId).then(() => {
                return true;
            });
        }
    }

    follow(targetId: number): Promise<any> {
        const body = {
            followedId: targetId
        };
        return this.http.post(ConfigurationService.api._FOLLOW, body, this.getOptions())
                        .toPromise()
                        .then(this.extractData);
    };

    unfollow(targetId: number): Promise<any> {
        const body = {
            followedId: targetId
        };
        return this.http.post(ConfigurationService.api._UNFOLLOW, body, this.getOptions())
                        .toPromise()
                        .then(this.extractData)
                        .catch(this.handleError);
    };

    private extractData(response: Response) {
        return {};
    }

    private handleError(error: Response) {
        // TODO: log error
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
