import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class TwitterService {
    promise: Promise<any>;
    config: {
        oauthCallback: any
    };
    twitterWindow: any;

    constructor(private http: Http) {
        this.config = {
            oauthCallback: null
        };
    }

    init() {
        this.config.oauthCallback = ConfigurationService.socials.twitter.callbackUri;
    }

    openLoginDialog(w, h): Promise<any> {
        this.promise = new Promise(() => {
            let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as any).left;
            let dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as any).top;

            let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const aHalf = 2;
            let left = ((width / aHalf) - (w / aHalf)) + dualScreenLeft;
            let top = ((height / aHalf) - (h / aHalf)) + dualScreenTop;

            let uri = ConfigurationService.socials.twitter.authUri;

            (window as any).$service = this;
            this.twitterWindow = window.open(uri, '', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        });

        return this.promise;
    }

    loginOnTwitter(params): Observable<any> {
        return this.http.post(ConfigurationService.api._LOGIN_TWITTER, params);
    }
}

export let twitterServiceInjectables: any[] = [{
    provide: TwitterService,
    useClass: TwitterService
}];
