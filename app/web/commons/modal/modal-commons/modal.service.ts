import { EventEmitter, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { EventService } from '../../../../shared/event/event.service';
import { ImageServiceOptions } from '../../../../shared/image/image-service-options.model';
import { Shard } from '../../../../shared/shard/shard.model';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { User } from '../../../../shared/user/user.model';
import { UserService } from '../../../../shared/user/user.service';
import { ToastService } from '../../toast/toast.service';
import { HelperPlanService } from '../modal-plan/helper-plan.service';
import { ModalPlanComponent } from '../modal-plan/modal-plan.component';
import { ModalShardDetailComponent } from '../modal-shard-detail/modal-shard-detail.component';
import { ModalShardNewMultipleComponent } from '../modal-shard-new-multiple/modal-shard-new-multiple.component';
import { ModalShardNewComponent } from '../modal-shard-new/modal-shard-new.component';
import { UserProfilePicCropperComponent } from '../modal-avatar-cropper/user.profile.pic.cropper.component';

@Injectable()
export class ModalService {
    private shardBackgroundOptions: ImageServiceOptions;
    private translationLabels: any;
    private modalRefArray: NgbModalRef[];

    constructor(private eventService: EventService,
                private ngbModal: NgbModal,
                private helperPlanService: HelperPlanService,
                private userService: UserService,
                private toastService: ToastService,
                private i18nService: I18nService) {
        this.translationLabels = this.i18nService.getTranslationLabels();
        this.modalRefArray = [];
    }

    // can't bind strongly 'shard' parameters to 'Shard' type because we use openPlan method to pass Hotels type too
    openPlan(shard): NgbModalRef {
        this.dismissAllModals();
        const modalRef: NgbModalRef = this.ngbModal.open(ModalPlanComponent, { size: 'lg' });
        this.modalRefArray.push(modalRef);

        let shardTitle = '';
        const shardIconSuffix = ConfigurationService.linkedPlaceType[ shard.bit ];

        this.shardBackgroundOptions = new ImageServiceOptions();
        switch (shard.bit) {
            case ConfigurationService.shardsBitMask.place:
            case ConfigurationService.shardsBitMask.placeAttraction:
            case ConfigurationService.shardsBitMask.placeHotel:
                // shards of category "place" dosn't have masterId property nor place property
                this.shardBackgroundOptions.id = shard.id;
                shardTitle = shard.title;
                shard = shard;
                break;
            default:
                this.shardBackgroundOptions.id = shard.masterId;
                shardTitle = shard.place.title;
                shard = shard.place;
                break;
        }

        const shardIconClasses = `wn-icon wn-icon-${shardIconSuffix} wn-icon-${shardIconSuffix}-color`;
        modalRef.componentInstance.componentData = {
            backgroundOptions: this.shardBackgroundOptions,
            id: this.shardBackgroundOptions.id, // shard.id,
            shard: shard,
            shardIconClasses: shardIconClasses,
            title: shardTitle,
            user: shard.user
        };

        modalRef.result.then((result) => {
            this.toastService.raisePlanned(result);
            if (this.userService.hasOnboardingPlanDone() === false) {
                this.helperPlanService.completeOnBoarding();
            }

            this.eventService.broadcast('WN_EVT_SHARDPLANNED');
        }).catch((error) => {
            // log error
        });

        return modalRef;
    }

    openShardDetail(shard: Shard, currentUser: User): NgbModalRef {
        this.dismissAllModals();
        const modalRef: NgbModalRef = this.ngbModal.open(ModalShardDetailComponent);
        this.modalRefArray.push(modalRef);

        modalRef.componentInstance.shard = shard;
        modalRef.componentInstance.currentUser = currentUser;

        modalRef.result.then((result) => {
            if (result === 'shardDetail.request.plan') {
                this.openPlan(shard);
            }
        }).catch((error) => {
            // log error
            console.log('Error on open shard detail', error);
        });

        return modalRef;
    }

    openShardNew(): NgbModalRef {
        this.dismissAllModals();
        const modalRef = this.ngbModal.open(ModalShardNewComponent, { size: 'lg' });
        this.modalRefArray.push(modalRef);

        modalRef.componentInstance.labels = {
            addPicture: this.translationLabels.addPicture,
            addShard: this.translationLabels.addShard,
            cancel: this.translationLabels.cancel,
            describeYourShard: this.translationLabels.describeYourShard,
            description: this.translationLabels.description,
            newShard: this.translationLabels.newShard,
            selectAPosition: this.translationLabels.selectAPosition,
            shardIt: this.translationLabels.shardIt,
            shardedIt: this.translationLabels.shardedIt,
            yourProfile: this.translationLabels.yourProfile
        };

        modalRef.result.then((newShard) => {
            this.toastService.raiseNewShard(newShard);
            this.eventService.broadcast('WN_EVT_SHARD_CREATED', newShard);
        }).catch((error) => {
            // log error
        });

        return modalRef;
    }

    openShardNewMultiple(mainStage, tour, timelineTreeIndex: number): NgbModalRef {
        this.dismissAllModals();
        const modalRef = this.ngbModal.open(ModalShardNewMultipleComponent, { size: 'lg' });
        this.modalRefArray.push(modalRef);

        modalRef.componentInstance.mainStage = mainStage;
        modalRef.componentInstance.tour = tour;
        modalRef.componentInstance.timelineTreeIndex = timelineTreeIndex;

        modalRef.componentInstance.labels = {
            addPictures: this.translationLabels.addPictures,
            addShards: this.translationLabels.addShards,
            cancel: this.translationLabels.cancel,
            newShardMultiple: this.translationLabels.newShardMultiple,
            shardIt: this.translationLabels.shardIt,
            shardedIt: this.translationLabels.shardedIt
        };

        modalRef.result.then(() => {
            this.eventService.broadcast('WN_EVT_RENDER_GRID');
        }).catch((error) => {
            // log error
        });

        return modalRef;
    }

    openAvatarCrop(callback: Function): NgbModalRef {
        this.dismissAllModals();
        const modalRef = this.ngbModal.open(UserProfilePicCropperComponent);

        this.modalRefArray.push(modalRef);
        const onCropped = modalRef.componentInstance.onCropped as EventEmitter<string>;

        onCropped.subscribe((image) => {
            modalRef.close();
            if (image) {
                callback(image);
            }
        });

        return modalRef;
    }

    private dismissAllModals() {
        _.forEach(this.modalRefArray, function (modalRef) {
            modalRef.dismiss();
        });
    }
}
