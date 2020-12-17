import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RawParams, StateDeclaration, StateService } from 'ui-router-ng2';
import { UIRouter } from 'ui-router-ng2/router';

import { ConfigurationService } from '../../../shared/config/configuration.service';
import { FollowService } from '../../../shared/follow/follow.service';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { HelperShardService } from '../../../shared/shard/helper-shard.service';
import { ShardService } from '../../../shared/shard/shard.service';
import { UserService } from '../../../shared/user/user.service';
import { ModalService } from '../../commons/modal/modal-commons/modal.service';
import { HelperPlanService } from '../../commons/modal/modal-plan/helper-plan.service';
import { ModalPlanComponent } from '../../commons/modal/modal-plan/modal-plan.component';
import { ToastService } from '../../commons/toast/toast.service';
import Hotel from '../hotel.model';

@Component({
    providers: [
        ShardService
    ],
    selector: 'wn-hotel-view',
    styleUrls: ['./hotel-view.component.scss'],
    templateUrl: './hotel-view.component.html'
})
export class HotelViewComponent implements OnInit {
    @Input() translationResolved;

    actionbar: any = {};
    componentData: Hotel;
    translationsAmenities: any;
    translationsDescription: string;
    translationShard: any;
    translationFollowButton: any;
    translationNavbarSocial: any;
    translationPopovers: any;
    isTargetFollowed: boolean;

    private maxPhotos: number = 4;

    constructor(
        private followService: FollowService,
        private userService: UserService,
        private shardService: ShardService,
        private uiRouter: UIRouter,
        private ngbModal: NgbModal,
        private changeDetectorRef: ChangeDetectorRef,
        private toastService: ToastService,
        private helperPlanService: HelperPlanService,
        private modalService: ModalService
    ) {
        this.componentData = HelperShardService.initObject(new Hotel()) as Hotel;
        this.componentData.bit = ConfigurationService.shardsBitMask.hotel;
        this.planAction = this.planAction.bind(this);
    }

    ngOnInit() {
        // TODO: Move it into a resolve ASAP - Also, accessing current state params like this this.stateService.current.params needs further investigation, isn't trivial
        const hotelId = this.uiRouter.globals.params['hotelId'];

        this.initTranslations();

        this.shardService.getShardById(hotelId).then((response) => {

            this.componentData.coverData = {
                imageDetailsCount: response.imageDetailsCount,
                imageDetailsPrefix: response.imageDetailsPrefix,
                imageDetailsSuffix: response.imageDetailsSuffix
            };

            response.coordinates = response.lon + ',' + response.lat;

            HelperShardService.populate(this.componentData, response);

            this.isTargetFollowed = response.isFollowed;

            this.actionbar.items = [
                {
                    label: this.translationResolved.likes,
                    value: response.likeNumber
                },
                {
                    label: this.translationResolved.followers,
                    value: response.followNumber
                }
            ];

            this.actionbar.actions = [
                {
                    action: () => {
                        this.shardService.toggleLike(hotelId)
                            .then((response) => {
                                if (response.status === true) {
                                    this.actionbar.actions[0].iconClasses = 'wn-icon wn-icon-like wn-icon-like-color vertical-align-bottom';
                                } else {
                                    this.actionbar.actions[0].iconClasses = 'wn-icon wn-icon-like vertical-align-bottom';
                                }
                            })
                            .catch((error) => {
                                //
                            });

                    },
                    iconClasses: response.status === true ? 'wn-icon wn-icon-like wn-icon-like-color vertical-align-bottom' : 'wn-icon wn-icon-like vertical-align-bottom',
                    status: 'btn-default'
                },
                {
                    action: () => {
                        this.planAction();
                    },
                    iconClasses: 'wn-icon wn-icon-plan-empty wn-icon-plan-empty-color vertical-align-bottom',
                    label: this.translationResolved.plan,
                    status: 'btn-default'
                }
            ];

            // todo remember to use transition in resolve to get hotelId - Refs: https://github.com/ui-router/ng1-to-ng2/issues/28
            this.changeDetectorRef.detectChanges();

        });
    }

    planAction() {
        this.modalService.openPlan(this.componentData);
    }

    private initTranslations() {
        this.translationFollowButton = {
            follow: [this.translationResolved.follow, this.translationResolved.hotel].join(' '),
            unfollow: [this.translationResolved.unfollow, this.translationResolved.hotel].join(' ')
        };

        this.translationPopovers = {
            attraction: this.translationResolved.attraction,
            follow: this.translationResolved.follow,
            followers: this.translationResolved.followers,
            following: this.translationResolved.following,
            hotel: this.translationResolved.hotel,
            likes: this.translationResolved.likes,
            place: this.translationResolved.place,
            planned: this.translationResolved.planned,
            shards: this.translationResolved.shards,
            unfollow: this.translationResolved.unfollow
        };

        this.translationShard = {
            plan: this.translationResolved.plan,
            popovers: this.translationPopovers,
            topGrid: this.translationResolved.topGrid
        };

        this.translationsAmenities = {
            amenitiesList: this.translationResolved.amenitiesList,
            noAmenities: this.translationResolved.noAmenities,
            title: this.translationResolved.amenities
        };

        this.translationsDescription = this.translationResolved.description;
    }

}
