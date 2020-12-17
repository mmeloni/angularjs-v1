import { Component, EventEmitter, Input, Output } from '@angular/core';

import { StateService } from 'ui-router-ng2';

import { ShardService } from '../../../../../shared/shard/shard.service';
import { UserService } from '../../../../../shared/user/user.service';
import { ModalService } from '../../../modal/modal-commons/modal.service';
import { Notification, NotificationType } from '../notification.model';

@Component({
    selector: 'wn-notification-list',
    styleUrls: [ './notification-list.component.scss' ],
    templateUrl: './notification-list.component.html'
})
export class NotificationListComponent {
    @Input() notifications: Notification[];
    @Input() labels;
    @Input() showMarkAllAsRead: boolean;

    @Output() read = new EventEmitter<Notification>();
    @Output() readAll = new EventEmitter<any>();

    constructor(private stateService: StateService,
                private modalService: ModalService,
                private shardService: ShardService,
                private userService: UserService) {
        //
    }

    markAllAsRead() {
        this.readAll.next();
    }

    getIconClasses(bit: NotificationType) {
        return [
            'wn-icon',
            'wn-icon-sm',
            'wn-icon-' + this.getIconSuffix(bit),
            'wn-icon-' + this.getIconSuffix(bit) + '-color'
        ].join(' ');
    }

    goToByNotification(event: Event, notification: Notification) {
        event.preventDefault();
        this.navbarReadedNotification(notification);
        switch (notification.bit) {
            case NotificationType.Follow:
                this.goToProfilePage(notification.creatorNid);
                break;
            case NotificationType.Comment:
            case NotificationType.Like:
            case NotificationType.Tour:
                this.goToShardDetail(notification.shardId);
                break;
            default:
                // Impossible, I guess: we are switching an enum
                break;
        }
    }

    // public for testability's sake
    goToProfilePage(id) {
        // this.stateService.go('profile.view', { userId: id });
        this.stateService.go('profileById', { userNid: id });
    }

    // public for testability's sake
    goToShardDetail(shardId: number) {
        this.shardService.getShardById(shardId).then((shard) => {
            this.modalService.openShardDetail(shard, this.userService.getUser());
        }).catch((error) => {
            //
        });
    }

    private navbarReadedNotification(notification: Notification) {
        this.read.next(notification);
    }

    private getIconSuffix(bit: NotificationType): string {
        switch (bit) {
            case NotificationType.Comment:
                return 'comment';
            case NotificationType.Follow:
                return 'user-followed-fill';
            case NotificationType.Like:
                return 'like';
            case NotificationType.Tour:
                return 'tour';
            default:
                return '';
        }
    }
}
