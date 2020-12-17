import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { StateService } from 'ui-router-ng2';

import { ImageServiceOptions } from '../../../../shared/image/image-service-options.model';
import { Shard } from '../../../../shared/shard/shard.model';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { User } from '../../../../shared/user/user.model';
import { ActionBarItem } from '../../../../modules/user.interface/action-bar/action-bar-item/action-bar-item.model';

@Component({
    styleUrls: [ 'modal-shard-detail.component.scss' ],
    templateUrl: 'modal-shard-detail.component.html'
})
export class ModalShardDetailComponent implements OnInit {
    @Input() shard: Shard;
    @Input() currentUser: User;

    imageOptions: ImageServiceOptions;
    statisticsItems: ActionBarItem[];
    translations: any;
    creationDate: string;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private i18nService: I18nService,
        private stateService: StateService
    ) {
        //
    }

    ngOnInit() {
        const translationLabels = this.i18nService.getTranslationLabels();

        this.translations = {
            at: translationLabels.at,
            by: translationLabels.by,
            comments: translationLabels.comments,
            likes: translationLabels.likes,
            plan: translationLabels.plan,
            planned: translationLabels.planned,
            plannedIn: translationLabels.plannedIn,
            savedFrom: translationLabels.savedFrom,
            shardComments: {
                buttonLabel: translationLabels.comment,
                commentPlaceholder: translationLabels.writeAcomment
            },
            visit: translationLabels.visit
        };

        this.creationDate = moment(this.shard.creationDate).format('LL');

        this.imageOptions = new ImageServiceOptions();
        this.imageOptions.id = this.shard.masterId;
        this.imageOptions.format = 'original';

        this.statisticsItems = [
            {
                label: this.translations.planned,
                value: this.shard.planCount
            },
            {
                label: this.translations.comments,
                value: this.shard.commentsNumber
            },
            {
                label: this.translations.likes,
                value: this.shard.likeNumber
            }
        ];
    }

    goToShardSource(event: Event) {
        event.preventDefault();
        window.open(this.shard.inputUrl.toString());
    }

    goToBoard(event: Event) {
        event.preventDefault();
        this.ngbActiveModal.dismiss();
        this.stateService.go('board.view', { boardId: this.shard.boards[ 0 ].id });
    }

    goToUserProfile(event: Event) {
        event.preventDefault();
        this.ngbActiveModal.dismiss();
        this.stateService.go('profileById', { userNid: this.shard.user.nid });
    }

    plan(event: Event) {
        event.preventDefault();
        this.ngbActiveModal.close('shardDetail.request.plan');
    }
}
