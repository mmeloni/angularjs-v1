import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthenticationService } from '../../../shared/authentication/authentication.service';
import { FacebookService } from '../../../shared/social/facebook.service';

@Component({
    selector: 'wn-facebook-authentication',
    templateUrl: 'facebook-authentication.component.html'
})

export class FacebookAuthenticationComponent implements OnInit {
    @Input() label: string;
    @Input() cssClasses?: string = '';

    @Output() success = new EventEmitter<string>();
    @Output() error = new EventEmitter<any>();

    isLoading: boolean = false;
    buttonCssClasses: string = 'btn btn-facebook';

    constructor(
        private authenticationService: AuthenticationService,
        private facebookService: FacebookService
    ) {
        //
    }

    ngOnInit() {
        this.facebookService.init();

        if (this.cssClasses !== '') {
            this.buttonCssClasses = [this.buttonCssClasses, this.cssClasses].join(' ');
        }
    }

    signInViaFacebook(event: Event) {
        event.preventDefault();

        this.facebookService.login()
            .then((response: any) => {
                this.isLoading = true;

                // Call our backend API
                return this.authenticationService
                                    .signInViaFacebook$(response.authResponse.userID, response.authResponse.accessToken)
                                    .finally(() => {
                                        this.isLoading = false;
                                    })
                                    .first()
                                    .subscribe(
                                        (token) => {
                                            this.success.next(token);
                                        },
                                        (error) => {
                                            this.error.next(error);
                                        });
            })
            .catch((error) => {
                this.error.next(error);
            });
    }
}
