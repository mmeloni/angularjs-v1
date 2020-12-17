import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UIRouterModule } from 'ui-router-ng2';

import { ActionBarItemComponent } from './action-bar/action-bar-item/action-bar-item.component';
import { NumberHumanize } from './action-bar/action-bar-item/number-humanize.pipe';
import { ActionBarViewComponent } from './action-bar/action-bar-view/action-bar-view.component';
import { StatisticsBarComponent } from './action-bar/statistics-bar/statistics-bar.component';
import { AvatarComponent } from './_deprecated.avatar/avatar.component';
import { ButtonComponent } from './button/button.component';
import { CategoryIconComponent } from './category-icon-component/category-icon.component';
import { FollowButtonComponent } from './follow-button-component/follow-button.component';
import { GridTopAttractionItemComponent } from './grid-top/grid-top-attraction/grid-top-attraction-item/grid-top-attraction-item.component';
import { GridTopAttractionComponent } from './grid-top/grid-top-attraction/grid-top-attraction.component';
import { GridTopHotelItemComponent } from './grid-top/grid-top-hotel/grid-top-hotel-item/grid-top-hotel-item.component';
import { GridTopHotelComponent } from './grid-top/grid-top-hotel/grid-top-hotel.component';
import { GridTopPlaceItemComponent } from './grid-top/grid-top-place/grid-top-place-item/grid-top-place-item.component';
import { GridTopPlaceComponent } from './grid-top/grid-top-place/grid-top-place.component';
import { GridTopShardItemComponent } from './grid-top/grid-top-shard/grid-top-shard-item/grid-top-shard-item.component';
import { GridTopShardComponent } from './grid-top/grid-top-shard/grid-top-shard.component';
import { GridTopSightsComponent } from './grid-top/grid-top-sights/grid-top-sights.component';
import { IconLabelComponent } from './icon-label-component/icon-label.component';
import { IconComponent } from './icon/icon.component';
import { BackgroundImageDirective } from './image/background-image.directive';
import { ImageComponent } from './image/image.component';
import { ImgSrcDirective } from './image/img-src.directive';
import { MiniCoverComponent } from './image/mini-cover.component';
import { LikeButtonComponent } from './like-button-component/like-button.component';
import { MapsComponent } from './maps-component/maps.component';
import { PopoverPlaceComponent } from './popover/popover-place/popover-place.component';
import { PopoverUserComponent } from './popover/popover-user/popover-user.component';
import { ShardDetailOpenDirective } from './shard-detail-open.directive';
import { StarRatingComponent } from './star-rating-component/star-rating.component';
import { SocketService } from '../../shared/socket/socket.service';
import { ModalService } from '../../web/commons/modal/modal-commons/modal.service';
import { HelperPlanService } from '../../web/commons/modal/modal-plan/helper-plan.service';
import { EventService } from '../../shared/event/event.service';
import { UserProfileCoverComponent } from './user.profile.cover.component';
import { UserService } from '../../shared/user/user.service';
import { LazyPictureDirective } from './lazy.picture.directive/lazy.picture.directive';
import { UserProfilePicComponent } from './user.profile.pic.component';
import { UserProfilePicCropperComponent } from '../../web/commons/modal/modal-avatar-cropper/user.profile.pic.cropper.component';
import { ModalAvatarCropperModule } from '../../web/commons/modal/modal-avatar-cropper/modal.avatar.cropper.module';
import { ModalCommonsModule } from '../../web/commons/modal/modal-commons/modal-commons.module';

const components = [
    ButtonComponent,
    GridTopSightsComponent,
    CategoryIconComponent,
    IconLabelComponent,
    GridTopShardComponent,
    GridTopShardItemComponent,
    AvatarComponent,
    StarRatingComponent,
    MapsComponent,
    GridTopAttractionComponent,
    GridTopAttractionItemComponent,
    GridTopHotelItemComponent,
    GridTopHotelComponent,
    GridTopPlaceItemComponent,
    GridTopPlaceComponent,
    FollowButtonComponent,
    ImageComponent,
    ImgSrcDirective,
    LikeButtonComponent,
    BackgroundImageDirective,
    ShardDetailOpenDirective,
    IconComponent,
    MiniCoverComponent,
    PopoverPlaceComponent,
    PopoverUserComponent,
    ActionBarItemComponent,
    NumberHumanize,
    ActionBarViewComponent,
    StatisticsBarComponent,
    // new modules:
    LazyPictureDirective,
    UserProfileCoverComponent,
    UserProfilePicComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        UIRouterModule,
        NgbModule,
        ModalCommonsModule
    ],
    providers: [ SocketService, ModalService, HelperPlanService, UserService, EventService ]
})
export class UserInterfaceModule {
}
