import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StateService } from 'ui-router-ng2';

import { AuthenticationService } from '../../../../shared/authentication/authentication.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { UserService } from '../../../../shared/user/user.service';
import { HelperPublicSiteService } from '../../helper-public-site.service';

@Component({
    styleUrls: ['password-recovery-new-password-view.component.scss'],
    templateUrl: 'password-recovery-new-password-view.component.html'
})

export class PasswordRecoveryNewPasswordViewComponent implements AfterViewInit, OnInit {
    @Input() translationResolved;

    @ViewChild('autofocusControl') autofocusControl: ElementRef;

    model = {
        password: '',
        passwordConfirm: ''
    };
    labels: any;
    isLoading: boolean = false;
    isMatchingPasswords: boolean;
    errorMessage: string;

    constructor(
        private stateService: StateService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private helperPublicSiteService: HelperPublicSiteService
    ) {
        //
    }

    ngOnInit() {
        this.initLabels();
    }

    ngAfterViewInit() {
        this.autofocusControl.nativeElement.focus();
    }

    onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.isLoading = true;

        const source = this.userService
            .changePassword$(this.stateService.params.nid, this.stateService.params.code, this.model.password)
            .catch((error) => {
                this.errorMessage = this.getMessageByError(error);
                return Observable.of({});
            });

        source
            .finally(() => {
                this.isLoading = false;
            })
            .flatMap((signUpData) => {
                return this.authenticationService.signInChain$(signUpData);
            })
            .first()
            .subscribe(
                (token) => {
                    this.helperPublicSiteService.onAuthenticationSuccess(token);
                },
                (error) => {
                    this.errorMessage = this.helperPublicSiteService.onAuthenticationError(error, this.labels.helperAuthentication);
                });
    }

    matchPasswords(partialPassword) {
        this.isMatchingPasswords = this.model.password === this.model.passwordConfirm;
    }

    private initLabels() {
        this.labels = {
            http: this.translationResolved.http,
            newPassword: this.translationResolved.publicSite.newPassword
        };
    }

    private getMessageByError(error): string {
        let message: string;

        switch (error.status) {
            case ConfigurationService.httpStatusCodes.notFound:
                message = this.labels.newPassword.userNotFound;
                break;
            case ConfigurationService.httpStatusCodes.unauthorized:
                message = this.labels.newPassword.codeInvalid;
                break;
            default:
                message = this.labels.http.serverError;
                break;
        }

        return message;
    }
}
