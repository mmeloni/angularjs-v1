import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { StateService } from 'ui-router-ng2';

import { ConfigurationService } from '../../../shared/config/configuration.service';
import { User } from '../../../shared/user/user.model';
import { UserService } from '../../../shared/user/user.service';

@Component({
    styleUrls: ['password-recovery.component.scss'],
    templateUrl: 'password-recovery.component.html'
})

export class PasswordRecoveryComponent implements AfterViewInit, OnInit {
    @Input() translationResolved;

    @ViewChild('autofocusControl') autofocusControl: ElementRef;

    model = {
        user: ''
    };
    isLoading: boolean = false;
    errorMessage: string;
    labels: any;

    constructor(
        private userService: UserService,
        private stateService: StateService
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

        this.userService
            .recoverPassword$(this.model.user)
            .finally(() => {
                this.isLoading = false;
            })
            .first()
            .subscribe(
                (user: User) => {
                    this.stateService.go('codeCheck', { nid: user.nid });
                },
                (error) => {
                    if (error.status === ConfigurationService.httpStatusCodes.notFound) {
                        this.errorMessage = this.labels.passwordRecovery.credentialsNotFound;
                    } else {
                        this.errorMessage = this.labels.http.serverError;
                    }
                });
    }

    private initLabels() {
        this.labels = {
            http: this.translationResolved.http,
            passwordRecovery: this.translationResolved.publicSite.passwordRecovery
        };
    }
}
