import { Injectable } from '@angular/core';

import { ConfigurationService } from '../config/configuration.service';

declare let webpackGlobalVars: any;

@Injectable()
export class FacebookService {
    init() {
        // load the SDK asynchronously
        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/all.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = function () {
            // init the FB JS SDK
            FB.init({
                appId: ConfigurationService.socials.facebook.appId,
                status: true, // check Facebook Login status
                version: 'v2.4',
                xfbml: true // look for social plugins on the page
            });
        };
    }

    login() {
        return new Promise((resolve, reject) => {
            FB.login(function(response) {
                if (response.authResponse) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }, {scope: 'email'});
        });
    }

    inviteFriends() {
        FB.ui({
            app_id: ConfigurationService.socials.facebook.appId,
            link: webpackGlobalVars.facebookCallbackURL,
            method: 'send',
            redirect_uri: webpackGlobalVars.facebookCallbackURL
        }, null);
    }
}

export let facebookServiceInjectables: any[] = [{
    provide: FacebookService,
    useClass: FacebookService
}];
