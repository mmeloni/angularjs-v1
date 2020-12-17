import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RawParams, StateDeclaration, StateService } from 'ui-router-ng2';
import { UIRouter } from 'ui-router-ng2/router';

import { ConfigurationService } from '../../../shared/config/configuration.service';
import { FollowService } from '../../../shared/follow/follow.service';
import { ImageServiceOptions } from '../../../shared/image/image-service-options.model';
import { ImageService } from '../../../shared/image/image.service';
import { HelperShardService } from '../../../shared/shard/helper-shard.service';
import { ShardService } from '../../../shared/shard/shard.service';
import { UserService } from '../../../shared/user/user.service';
import { ModalService } from '../../commons/modal/modal-commons/modal.service';
import { HelperPlanService } from '../../commons/modal/modal-plan/helper-plan.service';
import { ModalPlanComponent } from '../../commons/modal/modal-plan/modal-plan.component';
import { ToastService } from '../../commons/toast/toast.service';

import Attraction from '../attraction.model';
import Place from '../place.model';

@Component({
    providers: [
        ShardService
    ],
    selector: 'wn-place-view',
    styleUrls: ['./attraction-and-place-view.component.scss'],
    templateUrl: './attraction-and-place-view.component.html'
})
export class AttractionAndPlaceViewComponent implements OnInit {
    @Input() translationResolved;

    // TODO delete comment when found correct type
    // componentData: Place;
    componentData: any;
    coverBackgroundOptions: ImageServiceOptions;
    isTargetFollowed: boolean;
    stateName: string;
    translationFollowButton: any;
    translationPopovers: any;
    translationShard: any;
    translationNavbarSocial: any;
    shardIconClasses: string;
    actionbar: any = {};
    shardIconBit: number;
    isMapCoverVisible: boolean = false;

    private maxPhotos: number = 4;

    constructor(
        private followService: FollowService,
        private userService: UserService,
        private shardService: ShardService,
        private uiRouter: UIRouter,
        private ngbModal: NgbModal,
        private changeDetectorRef: ChangeDetectorRef,
        private stateService: StateService,
        private toastService: ToastService,
        private helperPlanService: HelperPlanService,
        private modalService: ModalService
    ) {
        // inizializzo l'oggetto per evitare errori html
        this.planAction = this.planAction.bind(this);
        this.stateName = this.stateService.current.name;
        this.componentData = this.triageStateName();
        this.componentData.bit = this.triageStateNameIconBit();
    }

    ngOnInit() {
        // TODO: Accessing current state params like this this.stateService.current.params needs further investigation, isn't trivial
        const placeId = this.uiRouter.globals.params['placeId'];
        this.initTranslations();

        this.coverBackgroundOptions = {
            default: ConfigurationService.defaultImages.shard,
            format: 'cover',
            id: placeId,
            type: 'place'
        };

        // todo chiamare direttamente shard.service.ts e spostare nel resolve
        this.shardService.getShardById(placeId).then((response) => {
            // ['https://s3-eu-west-1.amazonaws.com/wayonara-prod/_shards/_double_shard_' + placeId + '.jpeg']; //HotelService.buildPhotos(this.maxPhotos, response.imageDetailsCount, response.imageDetailsPrefix, response.imageDetailsSuffix);
            response.coordinates = response.lon + ',' + response.lat;
            // popolo l'oggetto con i dati che arrivano dal rest, solo quelli permessi dall'interfaccia
            // chiamiamo helper shard
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
                        this.shardService.toggleLike(placeId)
                                .then((response) =>  {
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

            // todo remember to use transition in resolve to get placeId - Refs: https://github.com/ui-router/ng1-to-ng2/issues/28
            this.changeDetectorRef.detectChanges();

        });
    }

    planAction() {
        this.modalService.openPlan(this.componentData);
    }

    showMapCover() {
        this.isMapCoverVisible = true;
    }

    // TODO: necessary evil for component.shardIconClasses: delete when standardize interferency between place and stage icon
    private triageStateName() {
        let componentData;
        switch (this.stateName) {
            case 'place':
                componentData = HelperShardService.initObject(new Place()) as Place;
                this.shardIconClasses = 'wn-icon wn-icon-place wn-icon-place-color';
                break;
            case 'attraction':
                componentData = HelperShardService.initObject(new Attraction()) as Attraction;
                this.shardIconClasses = 'wn-icon wn-icon-attraction wn-icon-attraction-color';
                break;
            default:
                break;
        }
        return componentData;
    }

    // TODO: necessary evil for modal plan service: delete when standardize interferency between place and stage icon
    private triageStateNameIconBit() {
        let shardIconBit;
        switch (this.stateName) {
            case 'place':
                shardIconBit = ConfigurationService.shardsBitMask.stage;
                break;
            case 'attraction':
                shardIconBit = ConfigurationService.shardsBitMask.attraction;
                break;
            default:
                break;
        }
        return shardIconBit;
    }

    private initTranslations() {
        this.translationFollowButton = {
            follow: [this.translationResolved.follow, this.translationResolved[this.stateName]].join(' '),
            unfollow: [this.translationResolved.unfollow, this.translationResolved[this.stateName]].join(' ')
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
    }
}
