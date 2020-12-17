/**
 * Application boot.
 */

'use strict';

import { NgModule, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeAdapter } from '@angular/upgrade';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelper } from 'angular2-jwt';
import { Ng1ToNg2Module, uiRouterNgUpgrade } from 'ui-router-ng1-to-ng2';

import { AuthenticationService } from './shared/authentication/authentication.service';
import { FollowService } from './shared/follow/follow.service';
import { MailingListService } from './shared/mailing-list/mailing-list.service';
import { PlaceService } from './shared/place/place.service';
import { SessionService } from './shared/session/session.service';
import { FacebookService } from './shared/social/facebook.service';
import { InstagramService } from './shared/social/instagram.service';
import { TwitterService } from './shared/social/twitter.service';
import { SocketService } from './shared/socket/socket.service';
import { I18nService } from './shared/translation/i18n.service';
import { UploadService } from './shared/upload/upload.service';
import { UserService } from './shared/user/user.service';
import { WayonaraSharedModule } from './shared/wayonara.shared';
import { LoadingStateService } from './loading-state.service';

// For downgrading to Ng1
import { TrackingService } from './shared/tracking/tracking.service';
import { CoverUploadComponent } from './web/commons/file-upload/cover-upload.component';
import { FileUploadPreviewItemComponent } from './web/commons/file-upload/file-upload-preview/file-upload-preview-item/file-upload-preview-item.component';
import { HelperUploadCoverService } from './web/commons/file-upload/helper-upload-cover.service';
import { ModalService } from './web/commons/modal/modal-commons/modal.service';
import { NavbarSocialComponent } from './web/commons/navbar/navbar-social/navbar-social.component';
import { ToastService } from './web/commons/toast/toast.service';
import { TravelBoxStatisticsComponent } from './web/tour/travel-box/travel-box-statistics.component';
import { TutorialMessageComponent } from './web/tutorial-message/tutorial-message.component';
import { TutorialMessageService } from './web/tutorial-message/tutorial-message.service';
// End for downgrading to Ng1

import { AuthModule } from './auth.module';
import { ModalShardNewMultipleModule } from './web/commons/modal/modal-shard-new-multiple/modal-shard-new-multiple.module'; // until the Tour presentation page is ported to Angular
import { HotelModule } from './web/hotel/hotel.module';
import { OnboardingModule } from './web/onboarding/onboarding.module';
import { PlaceModule } from './web/place/place.module';
import { PublicSiteModule } from './web/public-site/public-site.module';
import { TravelBoxStatisticsModule } from './web/tour/travel-box/travel-box-statistics.module';
import { TutorialMessageModule } from './web/tutorial-message/tutorial-message.module';
import { ImagesProvider } from './providers/images.provider';
import { UserInterfaceModule } from './modules/user.interface/user.interface.module';
import { ActionBarViewComponent } from './modules/user.interface/action-bar/action-bar-view/action-bar-view.component';
import { StatisticsBarComponent } from './modules/user.interface/action-bar/statistics-bar/statistics-bar.component';
import { ImageComponent } from './modules/user.interface/image/image.component';
import { FollowButtonComponent } from './modules/user.interface/follow-button-component/follow-button.component';
import { ButtonComponent } from './modules/user.interface/button/button.component';
import { IconLabelComponent } from './modules/user.interface/icon-label-component/icon-label.component';
import { AvatarComponent } from './modules/user.interface/_deprecated.avatar/avatar.component';
import { IconComponent } from './modules/user.interface/icon/icon.component';
import { MiniCoverComponent } from './modules/user.interface/image/mini-cover.component';
import { PopoverPlaceComponent } from './modules/user.interface/popover/popover-place/popover-place.component';
import { PopoverUserComponent } from './modules/user.interface/popover/popover-user/popover-user.component';
import { StreamPageModule } from './modules/+stream';
import { ProfilePageModule } from './modules/+profile';
import { ProfileEditPageModule } from './modules/+profile.edit';

// temporary workaround for typing errors while we have a ng1-ng2 application
declare const angular: any;

let upgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule));
uiRouterNgUpgrade.setUpgradeAdapter(upgradeAdapter);

angular.module('wayonara.config', []);

angular.module('wayonara.commons', [
    'wayonara.shared',
    'ui.router',
    'ui.router.upgrade',
    'ui.router.state.events',
    'ngAnimate',
    'ngAria',
    'ngMessages'
]);

angular.module('wayonara.social', [
    'wayonara.commons',
    'ngMaterial',
    'ui.bootstrap',
    'infinite-scroll',
    'ngTagsInput',
    'gg.editableText'
]);

angular.module('wayonara.tour', [
    'wayonara.commons',
    'ui.bootstrap',
    'infinite-scroll',
    'ngTagsInput',
    'gg.editableText',
    'ngMaterial',
    'ngToast',
    'ngtrumbitta.services.lodash'
]);

angular.module('wayonara.booking', [
    'wayonara.commons',
    'ui.bootstrap',
    'infinite-scroll',
    'ngSanitize',
    'rzModule',
    'angularPayments'
]);

angular.module('wayonara.web', [ 'wayonara.config', 'wayonara.social', 'wayonara.tour', 'wayonara.booking' ]);

/**
 * Bootstrap the application
 */

angular.module('wayonara.web')
    .factory('TrackingService', upgradeAdapter.downgradeNg2Provider(TrackingService))
    .factory('FacebookService', upgradeAdapter.downgradeNg2Provider(FacebookService))
    .factory('InstagramService', upgradeAdapter.downgradeNg2Provider(InstagramService))
    .factory('TwitterService', upgradeAdapter.downgradeNg2Provider(TwitterService))
    .factory('MailingListService', upgradeAdapter.downgradeNg2Provider(MailingListService))
    .factory('SessionService', upgradeAdapter.downgradeNg2Provider(SessionService))
    .factory('TranslationService', upgradeAdapter.downgradeNg2Provider(I18nService))
    .factory('PlaceService', upgradeAdapter.downgradeNg2Provider(PlaceService))
    .factory('FollowService', upgradeAdapter.downgradeNg2Provider(FollowService))
    .factory('ModalService', upgradeAdapter.downgradeNg2Provider(ModalService))
    .factory('HelperUploadCoverService', upgradeAdapter.downgradeNg2Provider(HelperUploadCoverService))
    .factory('TutorialMessageService', upgradeAdapter.downgradeNg2Provider(TutorialMessageService))
    .factory('UploadService', upgradeAdapter.downgradeNg2Provider(UploadService))
    .factory('SocketService', upgradeAdapter.downgradeNg2Provider(SocketService))
    .factory('UserService', upgradeAdapter.downgradeNg2Provider(UserService))
    .factory('ToastService', upgradeAdapter.downgradeNg2Provider(ToastService))
    .factory('TrackingService', upgradeAdapter.downgradeNg2Provider(TrackingService))
    .factory('LoadingStateService', upgradeAdapter.downgradeNg2Provider(LoadingStateService))
    .factory('AuthenticationService', upgradeAdapter.downgradeNg2Provider(AuthenticationService));

upgradeAdapter.upgradeNg1Provider('Ng1EventService');

angular.module('wayonara.web')
    .directive('wnActionBarView', upgradeAdapter.downgradeNg2Component(ActionBarViewComponent) as angular.IDirectiveFactory)
    .directive('wnStatisticsBar', upgradeAdapter.downgradeNg2Component(StatisticsBarComponent) as angular.IDirectiveFactory)
    .directive('wnImageNg2', upgradeAdapter.downgradeNg2Component(ImageComponent) as angular.IDirectiveFactory)
    .directive('wnTutorialMessage', upgradeAdapter.downgradeNg2Component(TutorialMessageComponent) as angular.IDirectiveFactory)
    .directive('wnFollowButton', upgradeAdapter.downgradeNg2Component(FollowButtonComponent) as angular.IDirectiveFactory)
    .directive('wnNavbarSocial', upgradeAdapter.downgradeNg2Component(NavbarSocialComponent) as angular.IDirectiveFactory)
    .directive('wnButton', upgradeAdapter.downgradeNg2Component(ButtonComponent) as angular.IDirectiveFactory)
    .directive('wnTravelBoxStatistics', upgradeAdapter.downgradeNg2Component(TravelBoxStatisticsComponent) as angular.IDirectiveFactory)
    .directive('wnIconLabel', upgradeAdapter.downgradeNg2Component(IconLabelComponent) as angular.IDirectiveFactory)
    .directive('wnAvatar', upgradeAdapter.downgradeNg2Component(AvatarComponent) as angular.IDirectiveFactory)
    .directive('wnIcon', upgradeAdapter.downgradeNg2Component(IconComponent) as angular.IDirectiveFactory)
    .directive('wnCoverUpload', upgradeAdapter.downgradeNg2Component(CoverUploadComponent) as angular.IDirectiveFactory)
    .directive('wnFileUploadPreviewItemComponent', upgradeAdapter.downgradeNg2Component(FileUploadPreviewItemComponent) as angular.IDirectiveFactory)
    .directive('wnMiniCover', upgradeAdapter.downgradeNg2Component(MiniCoverComponent) as angular.IDirectiveFactory)
    .directive('wnPopoverPlace', upgradeAdapter.downgradeNg2Component(PopoverPlaceComponent) as angular.IDirectiveFactory)
    .directive('wnPopoverUser', upgradeAdapter.downgradeNg2Component(PopoverUserComponent) as angular.IDirectiveFactory);

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        Ng1ToNg2Module,
        WayonaraSharedModule,
        HotelModule,
        PlaceModule,
        OnboardingModule,
        TutorialMessageModule,
        TravelBoxStatisticsModule,
        NgbModule.forRoot(),
        FormsModule,
        PublicSiteModule,
        StreamPageModule,
        ProfilePageModule,
        ProfileEditPageModule,
        ModalShardNewMultipleModule, // until the Tour presentation page is ported to Angular
        UserInterfaceModule
    ],
    providers: [
        {
            deps: [ '$injector' ],
            provide: 'TranslationServiceNg1',
            useFactory: (i: any) => i.get('TranslationService')
        },
        LoadingStateService,
        ImagesProvider,
        JwtHelper
    ]
})
export class AppModule {
    ngDoBootstrap() {
        // override to prevent Angular 2 from bootstrapping itself
    }
}

// Hot Module Replacement. Botched while the application is hybrid.
if (module[ 'hot' ] !== undefined) {
    module[ 'hot' ].accept();
}

angular.element(document.body).ready(function () {
    upgradeAdapter.bootstrap(document.body, [ 'wayonara.web' ]);
});
