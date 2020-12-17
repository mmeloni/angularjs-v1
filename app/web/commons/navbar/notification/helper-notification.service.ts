import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { SocketService } from '../../../../shared/socket/socket.service';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { UserService } from '../../../../shared/user/user.service';
import { Notification } from './notification.model';

// const
import socketMessages from '../../../utilities/socket.messages';

@Injectable()
export class HelperNotificationService implements OnDestroy {
    notifications$: Observable<Notification[]>;
    notificationCount$: Observable<number>;

    private notificationsSource: BehaviorSubject<Notification[]>;
    private notificationCountSource: BehaviorSubject<number>;
    private notifications: Notification[];
    private currentUserNid: number;
    private isGettingNotifications = false;

    constructor(private socketService: SocketService,
                private userService: UserService,
                private i18nService: I18nService) {
        this.notifications = [];

        this.notificationsSource = new BehaviorSubject(this.notifications);
        this.notifications$ = this.notificationsSource.asObservable();

        this.notificationCountSource = new BehaviorSubject(this.notifications.length);
        this.notificationCount$ = this.notificationCountSource.asObservable();
    }

    init() {
        console.log('Initializing HelperNotificationService');
        this.socketService.configureAndStart();

        this.currentUserNid = this.userService.getUser().nid;

        this.socketService.socket.on(socketMessages.NEW_NOTIFICATION, this.addNotifications.bind(this));

        if (this.isGettingNotifications === false) {
            this.socketService.socket.emit(socketMessages.NAVBAR_READY, { nid: this.currentUserNid });
            this.isGettingNotifications = true;
        }
    }

    reset() {
        this.isGettingNotifications = false;
        this.notifications = [];
    }

    markNotificationAsRead(id: string) {
        this.markAsRead(id);

        // this last part should be done by the backend emitting a new full batch of notifications with updated "read" properties
        this.notificationsSource.next(
            this.notifications.map((notification) => {
                if (notification._id === id) {
                    notification.read = true;
                }
                return notification;
            })
        );
        this.notificationCountSource.next(this.countUnreadNotifications());
    }

    markAllAsRead() {
        // this last part should be done by the backend emitting a new full batch of notifications with updated "read" properties
        // after the client emits the - at this time - missing 'readed.all' message
        this.notificationsSource.next(
            this.notifications.map((notification) => {
                this.markAsRead(notification._id);
                notification.read = true;
                return notification;
            })
        );
        this.notificationCountSource.next(this.countUnreadNotifications());
    }

    ngOnDestroy() {
        this.socketService.socket.off(socketMessages.NEW_NOTIFICATION);
        this.isGettingNotifications = false;
    }

    private markAsRead(id: string) {
        this.socketService.socket.emit(socketMessages.NOTIFICATION_READ, { id: id });
    }

    private addNotifications(notificationData: any[]) {
        // `newNotification` pushes an array of notifications every time, never a single notification
        notificationData.forEach((notification) => {
            let namePrefix = '';
            if (this.i18nService.getCurrentLocale() === 'IT') {
                namePrefix = 'A ';
            }
            notification.prefix = { name: namePrefix };

            const newNotificationObject = new Notification(
                notification,
                this.i18nService.getTranslationLabels(),
                this.currentUserNid === notification.shardOwnerNid
            );
            // The backend should send different messages for the initial batch of notifications and for new notifications
            if (notificationData.length === 1) {
                this.notifications.unshift(newNotificationObject);
            } else {
                this.notifications.push(newNotificationObject);
            }
        });

        this.notificationsSource.next(this.notifications);
        this.notificationCountSource.next(this.countUnreadNotifications());
    }

    private countUnreadNotifications(): number {
        return this.notifications.filter((notification) => {
            return notification.read === false;
        }).length;
    }
}
