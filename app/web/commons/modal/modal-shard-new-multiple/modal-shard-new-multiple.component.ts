import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { Shard } from '../../../../shared/shard/shard.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { TourService } from '../../../../shared/tour/tour.service';
import { UserService } from '../../../../shared/user/user.service';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { HelperUploadShardService } from '../../file-upload/helper-upload-shard.service';

@Component({
    providers: [FileUploadService], // provide here so there's a new instance for every component instance
    styleUrls: ['modal-shard-new-multiple.component.scss'],
    templateUrl: 'modal-shard-new-multiple.component.html'
})

export class ModalShardNewMultipleComponent implements OnDestroy, OnInit {
    @Input() labels: any;
    @Input() mainStage: any;
    @Input() tour: any;
    @Input() timelineTreeIndex: number;

    model: {
        files: File[]
    };
    applyFilters: Function;
    progressBar: any;
    arePicturesChosen: boolean = false;
    isLoadingSubmitButton: boolean = false;

    private progressBarDefault: any;
    private uploadInterval: any;
    private fileSubscription: Subscription;
    private currentUserNid: number;

    constructor(
        private fileUploadService: FileUploadService,
        private helperUploadShardService: HelperUploadShardService,
        private ngbActiveModal: NgbActiveModal,
        private shardService: ShardService,
        private userService: UserService,
        private tourService: TourService,
        private ngZone: NgZone
    ) {
        this.applyFilters = this.helperUploadShardService.filterFile;
        this.currentUserNid = this.userService.getUser().nid;
    }

    ngOnInit() {
        this.model = { files: [] };

        this.resetLoadingStatus();

        this.fileSubscription = this.fileUploadService.filesToUpload$.subscribe((files: File[]) => {
            this.model.files = files;
            if (this.validateUpload(this.model.files) === true) {
                this.arePicturesChosen = true;
            } else {
                this.arePicturesChosen = false;
            }
        });
    }

    ngOnDestroy() {
        this.fileSubscription.unsubscribe();
    }

    removeFile(fileIndex: number) {
        this.fileUploadService.removeFileByIndex(fileIndex);
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.isLoadingSubmitButton = true;
        this.showLoadingProgress();

        const files = _.cloneDeep(this.model.files);

        Promise.all(_.map(files, this.populateShardUploadAndCreationPromises))
            .then((response) => {
                if (response !== undefined && response.length > 0) {
                    const shardCollection: Shard[] = _.flatMap(response, (item) => {
                        if (typeof item !== 'undefined' && item.shards !== undefined) {
                            return item.shards;
                        } else {
                            return [];
                        }
                    });
                    return this.updateTour(shardCollection);
                } else {
                    throw undefined;
                }
            })
            .then(() => {
                this.finalizeUpload();
            })
            .catch((error) => {
                this.isLoadingSubmitButton = false;
                this.showLoadingError(this.labels.newShardMultiple.upload.error);
            });
    }

    dismiss(event: Event) {
        event.preventDefault();
        this.ngbActiveModal.dismiss();
    }

    private validateUpload(files: File[]): boolean {
        let isValidated = false;
        const maxAllowedFiles = 10;

        if (files.length > maxAllowedFiles) {
            this.showLoadingError(this.labels.newShardMultiple.upload.validationMaxFiles);
        } else {
            this.resetLoadingStatus();
            isValidated = true;
        }

        return isValidated;
    }

    // this is a callback, so we are using a lambda to automagically rebind `this`
    private populateShardUploadAndCreationPromises = (file: File): Promise<any> => {
        const uploadPhotoId = uuid();
        const uploadFilename = ShardService.buildShardUploadFilename(file.name, this.currentUserNid, uploadPhotoId);

        return this.shardService.uploadPhoto(file, uploadFilename)
            .then((() => {
                return this.createShard(file, uploadFilename, uploadPhotoId);
            }))
            // .then((response) => {
            //     How cool would have been to launch a re-render of the grid here?
            //     You upload a Shard, and it pops in the timeline under the modal while the other Shards get uploaded.
            //     Pretty cool!
            //     It doesn't work. The Grid gets the event, but the render doesn't work.
            //
            //     Feel free to try, if you can come up with the right idea.
            //
            //     this.eventService.broadcast('WN_EVT_RENDER_GRID');
            //     return response; // this is needed for chaining the Promise.all() up there
            // })
            .catch((error) => {
                throw error;
            });
    }

    private createShard(file: File, uploadFilename: string, uploadPhotoId: string): Promise<any> {
        const shardArray: Shard[] = [this.createShardObject(uploadFilename, uploadPhotoId)];
        return this.shardService.createShards(shardArray);
    }

    private createShardObject(uploadFilename: string, uploadPhotoId: string ): Shard {
        let shard = new Shard();

        shard.nearestPoiId = this.mainStage.model.nearestPoiId;
        shard.bit = ConfigurationService.shardsBitMask.stage;
        shard.description = '';
        shard.upLoadfileName = uploadFilename;
        shard.uploadPhotoId = uploadPhotoId;

        return shard;
    }

    private updateTour(shardCollection: Shard[]): Promise<any> {
        if (typeof this.tour.timeline[this.timelineTreeIndex].shardsCollection === 'undefined') {
            this.tour.timeline[this.timelineTreeIndex].shardsCollection = [];
        }

        _.forEach(shardCollection, (shard: Shard) => {
            this.tour.timeline[this.timelineTreeIndex].shardsCollection.push(shard);
        });

        return this.tourService.updateTour$(this.tour).toPromise();
    }

    private finalizeUpload(newShard?) {
        this.ngZone.runGuarded(() => {
            clearInterval(this.uploadInterval);
            this.showLoadingComplete(this.labels.newShardMultiple.upload.complete);

            const waitTime = 1000;
            const timeout = setTimeout(() => {
                this.isLoadingSubmitButton = false;
                this.ngbActiveModal.close(newShard);
            }, waitTime);
        });
    }

    // Possible refactor to common method - see modal-shard-new
    private resetLoadingStatus(message?: string) {
        const progressBarDefault = {
            isAnimated: true,
            isStriped: true,
            isUploading: false,
            label: this.labels.newShardMultiple.upload.inProgress,
            type: null,
            value: 20
        };

        this.progressBar = progressBarDefault;

        if (message !== undefined) {
            this.progressBar.label = message;
        }
    }

    // Possible refactor to common method - see modal-shard-new
    private showLoadingError(message: string) {
        this.ngZone.runGuarded(() => {
            clearInterval(this.uploadInterval);

            this.progressBar = {
                isAnimated: false,
                isStriped: false,
                isUploading: true,
                label: message,
                type: 'warning',
                value: 100
            };
        });
    }

    // Possible refactor to common method - see modal-shard-new
    private showLoadingComplete(message: string) {
        this.progressBar = {
            isAnimated: false,
            isStriped: false,
            isUploading: true,
            label: message,
            type: 'success',
            value: 100
        };
    }

    // Possible refactor to common method - see modal-shard-new
    private showLoadingProgress(message?: string) {
        this.ngZone.runGuarded(() => {
            this.resetLoadingStatus(message);
            this.progressBar.isUploading = true;

            const minValueStep = 1;
            const maxValueStep = 5;
            const maxValue = 98;
            const intervalStep = 1250;
            this.uploadInterval = setInterval(() => {
                if (this.progressBar.value < maxValue) {
                    const stepValue = Math.floor(Math.random() * (maxValueStep - minValueStep + 1)) + minValueStep;
                    this.progressBar.value += stepValue;
                } else {
                    clearInterval(this.uploadInterval);
                }
            }, intervalStep);
        });
    }
}
