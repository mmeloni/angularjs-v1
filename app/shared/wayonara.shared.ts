import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AuthenticationService } from './authentication/authentication.service';
import { BoardService } from './board/board.service';
import { ConfigurationService } from './config/configuration.service';
import { EventService } from './event/event.service';
import { FollowService } from './follow/follow.service';
import { ImageService } from './image/image.service';
import { LikesProvider } from '../providers/likes.provider/likes.provider';
import { MailingListService } from './mailing-list/mailing-list.service';
import { PlaceService } from './place/place.service';
import { SessionService } from './session/session.service';
import { ShardService } from './shard/shard.service';
import { FacebookService } from './social/facebook.service';
import { InstagramService } from './social/instagram.service';
import { TwitterService } from './social/twitter.service';
import { SocketService } from './socket/socket.service';
import { TourService } from './tour/tour.service';
import { TrackingService } from './tracking/tracking.service';
import { I18nService } from './translation/i18n.service';
import { UploadService } from './upload/upload.service';
import { UserService } from './user/user.service';

// temporary workaround for typing errors while we have a ng1-ng2 application
declare var angular: any;

angular.module('wayonara.shared', ['ngStorage', 'btford.socket-io']);

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        HttpModule
    ],
    providers: [
        ConfigurationService,
        EventService,
        TrackingService,
        FacebookService,
        InstagramService,
        TwitterService,
        SessionService,
        MailingListService,
        I18nService,
        PlaceService,
        UserService,
        FollowService,
        UploadService,
        ImageService,
        LikesProvider,
        TourService,
        BoardService,
        ShardService,
        SocketService,
        AuthenticationService
    ]
})
export class WayonaraSharedModule { }
