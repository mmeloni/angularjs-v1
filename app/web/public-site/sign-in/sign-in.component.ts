import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '../../../shared/authentication/authentication.service';
import { HelperNotificationService } from '../../commons/navbar/notification/helper-notification.service';
import { AuthorInfo } from '../author-info/author-info.model';
import { HelperPublicSiteService } from '../helper-public-site.service';

@Component({
    styleUrls: [ 'sign-in.component.scss' ],
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent implements AfterViewInit, OnInit {
    @Input() translationResolved;

    @ViewChild('autofocusControl') autofocusControl: ElementRef;

    labels: any;
    model: any = {
        _password: '',
        _username: ''
    };
    isLoading: boolean = false;
    authenticationError: any = {
        email: '',
        password: '',
        username: ''
    };
    photoAuthor: AuthorInfo;

    constructor(private authenticationService: AuthenticationService,
                private helperPublicSiteService: HelperPublicSiteService,
                private helperNotificationService: HelperNotificationService) {
        //
    }

    ngOnInit() {
        this.initLabels();

        this.photoAuthor = {
            imageSrc: '/assets/img/public/giuseppe-scaperrotta.jpg',
            subtitle: 'Indipendent traveller',
            title: 'Giuseppe Scaperrotta'
        };
    }

    ngAfterViewInit() {
        this.autofocusControl.nativeElement.focus();
    }

    onSubmit(event: Event) {
        this.isLoading = true;

        this.authenticationService
            .signIn$(this.model)
            .finally(() => {
                this.isLoading = false;
            })
            .first()
            .subscribe(
                (token) => {
                    this.helperPublicSiteService.onAuthenticationSuccess(token);
                    this.helperNotificationService.init();
                },
                (error) => {
                    this.authenticationError = this.helperPublicSiteService.onAuthenticationError(error, this.labels.helperAuthentication);
                });
    }

    onFacebookSignInSuccess(token: string) {
        this.helperPublicSiteService.onAuthenticationSuccess(token);
        this.helperNotificationService.init();
    }

    onFacebookSignInError(error: any) {
        this.authenticationError = this.helperPublicSiteService.onAuthenticationError(error, this.labels.helperAuthentication);
    }

    private initLabels() {
        this.labels = {
            commons: this.translationResolved.publicSite.commons,
            helperAuthentication: {
                email: this.translationResolved.email,
                http: this.translationResolved.http,
                username: this.translationResolved.username
            },
            signIn: this.translationResolved.publicSite.signIn
        };
    }
}
