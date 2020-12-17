import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from 'ui-router-ng2';
import { BoardService } from '../../../../shared/board/board.service';
import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { ImageServiceOptions } from '../../../../shared/image/image-service-options.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { TourService } from '../../../../shared/tour/tour.service';
import { TrackingService } from '../../../../shared/tracking/tracking.service';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { UserService } from '../../../../shared/user/user.service';
import { TutorialMessageService } from '../../../tutorial-message/tutorial-message.service';

@Component({
    providers: [
        ShardService
    ],
    selector: 'wn-modal-plan-content',
    styleUrls: [ './modal-plan.component.scss' ],
    templateUrl: 'modal-plan.component.html'
})
export class ModalPlanComponent implements OnDestroy, OnInit {
    @Input() componentData;

    toursItems: any[] = [];
    boardItems: any[] = [];
    activeTab: string = 'board';
    modality: string = 'list';
    initialName: string = '';
    translations: any;
    isLoadingPlanButton: boolean = false;

    constructor(private ngbActiveModal: NgbActiveModal,
                private shardService: ShardService,
                private tourService: TourService,
                private boardService: BoardService,
                private i18nService: I18nService,
                private stateService: StateService,
                private trackingService: TrackingService,
                private tutorialMessageService: TutorialMessageService,
                private userService: UserService) {
        this.setSuggestedBoard = this.setSuggestedBoard.bind(this);
        this.setSuggestedTour = this.setSuggestedTour.bind(this);
        this.getBoardsFromCurrentUser = this.getBoardsFromCurrentUser.bind(this);
        this.getToursFromCurrentUser = this.getToursFromCurrentUser.bind(this);
    }

    ngOnInit() {
        const translationLabels = this.i18nService.getTranslationLabels();
        this.translations = {
            allYourBoards: translationLabels.allYourBoards,
            allYourTours: translationLabels.allYourTours,
            boards: translationLabels.boards,
            cancel: translationLabels.CANCEL,
            create: translationLabels.create,
            createBoard: translationLabels.createBoard,
            createTour: translationLabels.createTour,
            description: translationLabels.description,
            firstBoard: translationLabels.onboarding.setup.tutorialMessages.firstBoard,
            firstTour: translationLabels.onboarding.setup.tutorialMessages.firstTour,
            name: translationLabels.name,
            plan: translationLabels.plan,
            searchFlights: translationLabels.searchFlights,
            suggestedBoard: translationLabels.suggestedBoard,
            suggestedTour: translationLabels.suggestedTour,
            title: translationLabels.createBoardOrTour,
            tours: translationLabels.tours
        };

        this.getBoardsFromCurrentUser();
        this.getToursFromCurrentUser();
        this.showTutorial();
    }

    showTutorial() {
        if (!this.userService.hasOnboardingPlanDone()) {
            switch (this.activeTab) {
                case 'tour':
                    this.tutorialMessageService.showTutorialMessage({
                        message: this.translations.firstTour
                    });
                    break;
                default:
                    this.tutorialMessageService.showTutorialMessage({
                        message: this.translations.firstBoard
                    });
                    break;
            }
        }
    }

    getBoardsFromCurrentUser() {
        this.boardService.getUserBoards(1).then((response) => {
            this.boardItems = response;
        });
    }

    getToursFromCurrentUser() {
        const params = {
            bit: ConfigurationService.shardsBitMask.tour,
            page: 1,
            pageSize: 999,
            sortModeBm: ConfigurationService.sortBitMask.SCORE,
            user: this.userService.getUser().nid
        };

        this.shardService.getShardStreamByOptions(params).then((response) => {
            this.toursItems = response.shards;
        });
    }

    changeTab($event: any, tab: string) {
        if ($event !== null) {
            $event.preventDefault();
        }

        this.activeTab = tab;
        this.showTutorial();
        this.isLoadingPlanButton = false;
    }

    changeModality(event: Event, mod: string) {
        switch (mod) {
            case 'createBoard':
                this.trackingService.trigger('createBoard');
                break;
            case 'createTour':
                this.trackingService.trigger('createTour');
                break;
            default:
                break;
        }

        if (event !== null && event !== undefined) {
            event.preventDefault();
        }

        this.modality = mod;
    }

    setSuggestedBoard($event, text) {
        this.trackingService.trigger('setSuggestedBoard');

        this.initialName = text;
        this.changeModality($event, 'createBoard');
    }

    setSuggestedTour($event, text) {
        this.trackingService.trigger('setSuggestedTour');

        this.initialName = text;
        this.changeModality($event, 'createTour');
    }

    onCancelForm($event) {
        this.trackingService.trigger('cancelTourBoardCreation');

        this.changeModality($event, 'list');
        this.initialName = '';
    }

    planOnBoard(imageOptions: ImageServiceOptions, boardData) {
        this.trackingService.trigger('planOnBoard');

        this.isLoadingPlanButton = true;
        this.boardService.planShardsToBoard(boardData).then((response) => {
            this.isLoadingPlanButton = false;

            // imageOptions could be null, because if it's null the toast will show a wn-icon-info
            // So that's why here we check if it's !== null
            if (imageOptions !== null && imageOptions !== undefined && imageOptions.id === null) {
                imageOptions.id = response;
            }

            this.ngbActiveModal.close({
                imageOptions: imageOptions,
                toParams: { boardId: response },
                toState: 'board.view',
                // temporary: use reponse.title once the API gets updated
                toTitle: this.translations.boards
            });
        });
    }

    saveNewBoard(model) {
        this.trackingService.trigger('saveNewBoard');

        const imageOptions: ImageServiceOptions = {
            default: ConfigurationService.defaultImages.boardPreview,
            format: 'square',
            id: null,
            type: 'shard'
        };

        const boardData = {
            board: model,
            shardsId: [ this.componentData.id ]
        };

        this.planOnBoard(imageOptions, boardData);
    }

    saveNewTour(model) {
        this.trackingService.trigger('saveNewTour');

        this.isLoadingPlanButton = true;

        const tourData = Object.assign(model, { shardsId: [ this.componentData.id ] });
        this.tourService.createTour$(tourData).first().subscribe((response) => {
            this.isLoadingPlanButton = false;

            const imageOptions: ImageServiceOptions = {
                default: ConfigurationService.defaultImages.tourPreview,
                format: 'square',
                id: response.id,
                type: 'shard'
            };

            this.ngbActiveModal.close({
                imageOptions: imageOptions,
                toParams: { tourId: response.id },
                toState: 'tour.edit.plan',
                toTitle: response.title
            });
        });
    }

    fastQuote(event) {
        this.trackingService.trigger('fastQuote');
        this.isLoadingPlanButton = true;
        this.ngbActiveModal.close();
        this.tourService.createRoundtripTour$(this.userService.getUser().city.place, this.componentData.shard).first().subscribe((response) => {
            this.isLoadingPlanButton = false;
            this.stateService.go('tour.edit.quote', { index: 1, tourId: response.id });
        });
    }

    ngOnDestroy() {
        this.tutorialMessageService.hideTutorialMessage();
    }
}
