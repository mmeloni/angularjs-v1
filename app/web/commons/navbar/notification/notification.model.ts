import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../shared/image/image-service-options.model';
import { ImageService } from '../../../../shared/image/image.service';

const shiftComment = 0;
const shiftLike = 2;
const shiftFollow = 3;
const shiftTour = 4;

export enum NotificationType {
    Comment = 1 << shiftComment,
    Like    = 1 << shiftLike,
    Follow  = 1 << shiftFollow,
    Tour    = 1 << shiftTour
}

export class Notification {
    _id: string;
    bit: NotificationType;
    creatorNid: number;
    creatorUsername: string;
    eventIcon: string;
    eventImageOptions: ImageServiceOptions;
    icon: string;
    masterId: number;
    prefix: Object = { name: ''};
    read: boolean;
    shardId: number;
    text: string;

    constructor(data: any, labels: any, isCurrentUserShardOwner: boolean) {
        this.creatorUsername = data.creatorUsername;
        this.creatorNid = data.creatorNid;
        this.shardId = data.shardId;
        this._id = data._id;
        this.read = data.read;
        this.bit = data.bit;

        if (data.masterId !== undefined) {
            const imgType = 'shard';
            this.eventImageOptions = {
                default: ConfigurationService.defaultImages[imgType],
                format: 'square',
                id: data.masterId,
                type: imgType
            };
        }

        switch (this.bit) {
            case NotificationType.Comment:
                this.icon = 'comment';
                this.eventIcon = 'event-icon-comment';
                this.text = (isCurrentUserShardOwner === true) ? labels.commentedOnShardYour : labels.commentedOnShard;
                break;

            case NotificationType.Like:
                this.icon = 'like';
                this.eventIcon = 'event-icon-like';
                this.prefix = data.prefix;
                this.text = labels.likedYourPhoto;
                break;

            case NotificationType.Follow:
                this.icon = 'follow';
                this.eventIcon = 'event-icon-follow';
                this.text = labels.startedFollowingYou;
                break;

            case NotificationType.Tour:
                this.icon = 'tour';
                this.eventIcon = 'event-icon-follow';
                this.text = labels.invitedYouOnTour;
                break;
            default:
                // Impossible, I guess: we are switching an enum
                break;
        }
    }
}
