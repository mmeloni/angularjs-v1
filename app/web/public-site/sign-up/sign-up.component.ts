import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '../../../shared/authentication/authentication.service';
import { UserService } from '../../../shared/user/user.service';
import { AuthorInfo } from '../author-info/author-info.model';
import { HelperPublicSiteService } from '../helper-public-site.service';
import { HelperNotificationService } from '../../commons/navbar/notification/helper-notification.service';

@Component({
    styleUrls: [ 'sign-up.component.scss' ],
    templateUrl: 'sign-up.component.html'
})

export class SignUpComponent implements AfterViewInit, OnInit {
    @Input() translationResolved;

    @ViewChild('autofocusControl') autofocusControl: ElementRef;

    labels: any;
    model: any = {
        email: '',
        firstname: '',
        password: '',
        username: ''
    };
    isLoading: boolean = false;
    authenticationError: any = {
        email: '',
        password: '',
        username: ''
    };
    photoAuthor: AuthorInfo;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private helperPublicSiteService: HelperPublicSiteService,
                private helperNotificationService: HelperNotificationService) {
        //
    }

    ngOnInit() {
        this.initLabels();

        this.photoAuthor = {
            imageSrc: '/assets/img/public/carlo-parisi.jpg',
            subtitle: 'Passionate Traveller @ SpaceSalmon.com',
            title: 'Carlo Parisi'
        };
    }

    ngAfterViewInit() {
        this.autofocusControl.nativeElement.focus();
    }

    onSubmit(event: Event) {
        this.isLoading = true;

        this.userService
            .createUser$(this.model)
            .finally(() => {
                this.isLoading = false;
            })
            .flatMap((signUpData) => {
                return this.authenticationService.signInChain$(signUpData);
            })
            .flatMap(() => {
                return this.userService.tbTrackingCall$(this.userService.getUser().nid);
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

    onFacebookSignUpSuccess(token: string) {
        this.helperPublicSiteService.onAuthenticationSuccess(token);
        this.helperNotificationService.init();
    }

    onFacebookSignUpError(error: any) {
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
            signUp: this.translationResolved.publicSite.signUp,
            username: this.translationResolved.username
        };
    }
}
