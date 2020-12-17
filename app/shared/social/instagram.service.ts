import { Injectable } from '@angular/core';
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class InstagramService {
    public promise: Promise<any>;
    public igWindow: any;
    public config: {
        clientID: any,
        redirectUri: any,
        code: any
    };

    constructor() {
        this.config = {
            clientID: null,
            code: null,
            redirectUri: null
        };
    }

    init() {
        this.config.clientID = ConfigurationService.socials.instagram.clientId;
        this.config.redirectUri = ConfigurationService.socials.instagram.callbackUri;
    }

    openLoginDialog(w, h) {
        this.promise = new Promise(() => {
            let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as any).left;
            let dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as any).top;

            let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const aHalf = 2;
            let left = ((width / aHalf) - (w / aHalf)) + dualScreenLeft;
            let top = ((height / aHalf) - (h / aHalf)) + dualScreenTop;

            let uri = ConfigurationService.socials.instagram.authUri
                .replace('{clientID}', this.config.clientID)
                .replace('{redirectUri}', this.config.redirectUri);

            (window as any).$service = this;
            this.igWindow = window.open(uri, '', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        });

        return this.promise;
    }

    closeLoginDialog() {
        this.igWindow.close();
    }

    setCode(code: any) {
        this.config.code = code;
    }

    getCode() {
        return this.config.code;
    }
}

export let instagramServiceInjectables: any[] = [{
    provide: InstagramService,
    useClass: InstagramService
}];
