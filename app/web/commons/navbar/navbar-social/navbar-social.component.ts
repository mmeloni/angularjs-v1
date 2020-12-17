import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StateService } from 'ui-router-ng2';

import { LoadingStateService } from '../../../../loading-state.service';
import { TourService } from '../../../../shared/tour/tour.service';
import { UserService } from '../../../../shared/user/user.service';
import { HelperNotificationService } from '../notification/helper-notification.service';
import { Notification } from '../notification/notification.model';

@Component({
    selector: 'wn-navbar-social',
    styleUrls: [ 'navbar-social.component.scss' ],
    templateUrl: 'navbar-social.component.html'
})
export class NavbarSocialComponent implements OnDestroy, OnInit {
    // WARNING: pass the whole `translationResolved` object until the application - or the routing - is full-NG2 and we can
    // avoid it using parent-child inheritance, named views, and so on.
    @Input() labels: any;

    currentUser: any;
    isCollapsed = true;
    notifications: Observable<Notification[]>;
    subscriptionNotificationCount: Subscription;
    notificationCount: number;
    isLoadingGeneral: Observable<boolean>;

    constructor(private stateService: StateService,
                private tourService: TourService,
                private userService: UserService,
                private helperNotificationService: HelperNotificationService,
                private loadingStateService: LoadingStateService) {
    }

    ngOnInit() {
        this.isLoadingGeneral = this.loadingStateService.isLoading$;

        // Because we are using the async pipe in the template
        this.notifications = this.helperNotificationService.notifications$;

        // WARNING: this method is necessary while we keep passing the full `translationResolved` object.
        // See comment about Input() labels.
        this.initTranslations();

        const user = this.userService.getUser();
        this.currentUser = {
            id: user.nid,
            username: user.username
        };

        this.subscriptionNotificationCount = this.helperNotificationService.notificationCount$.subscribe((count) => {
            this.notificationCount = count;
        });
    }

    ngOnDestroy() {
        if (this.subscriptionNotificationCount !== undefined) {
            this.subscriptionNotificationCount.unsubscribe();
        }
    }

    navbarReadedNotification(notification: Notification) {
        this.helperNotificationService.markNotificationAsRead(notification._id);
    }

    markAllAsRead() {
        this.helperNotificationService.markAllAsRead();
    }

    planATour = function () {
        const emptyTour = { shardsId: null, title: '' };

        this.tourService.createTour$(emptyTour).first().subscribe((response) => {
            const tour = response;
            this.stateService.go('tour.edit.plan', { tourId: tour.id });
        });
    };

    goToHome(event?: Event) {
        if (event !== undefined) {
            event.preventDefault();
        }
        this.stateService.go('home');
    }

    goToLogout(event: Event) {
        event.preventDefault();

        this.helperNotificationService.reset();
        this.stateService.go('logout');
    }

    // WARNING: this method is necessary while we keep passing the full `translationResolved` object.
    // See comment above, about: `Input() labels`.
    private initTranslations() {
        const omnisearch = {
            placeholder: [ this.labels.search_on, 'Wayonara...' ].join(' '),
            searchAllShards: this.labels.searchAllShards
        };
        const notificationList = {
            markAll: this.labels.notificationsCheckAll,
            title: this.labels.Notifications
        };
        const addShard = this.labels.addShard;

        this.labels = {
            addShard: addShard,
            myBookings: this.labels.myBookings,
            notificationList: notificationList,
            omnisearch: omnisearch,
            planATour: this.labels.planATour,
            profile: this.labels.profile,
            signOut: this.labels.logout
        };
    }
}
