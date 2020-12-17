import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

import { ConfigurationService } from '../../../../shared/config/configuration.service';
import { Shard } from '../../../../shared/shard/shard.model';
import { ShardService } from '../../../../shared/shard/shard.service';
import { I18nService } from '../../../../shared/translation/i18n.service';
import { UserService } from '../../../../shared/user/user.service';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { GPSCoordinates } from '../../file-upload/gps-coordinates.model';
import { HelperUploadShardService } from '../../file-upload/helper-upload-shard.service';

@Component({
    templateUrl: 'modal-shard-new.component.html'
})
export class ModalShardNewComponent implements OnDestroy, OnInit {
    @Input() labels: any;

    model = {
        description: '',
        file: null,
        inputUrl: null,
        poi: null,
        siteName: null
    };
    applyFilters: Function;
    selectedPoiIconClasses = 'wn-icon wn-icon-place';
    progressBar: any;
    isPictureChosen = false;
    isLoadingSubmitButton: boolean = false;
    // TODO: Define a proper custom type for POIs, use it also in the HTTP methods and everywhere else needed
    filteredPois: any[];

    private progressBarDefault: any;
    private uploadInterval: any;
    private fileSubscription: Subscription;

    constructor(
        private shardService: ShardService,
        private userService: UserService,
        private fileUploadService: FileUploadService,
        private helperUploadShardService: HelperUploadShardService,
        private ngbActiveModal: NgbActiveModal,
        private i18nService: I18nService,
        private ngZone: NgZone
    ) {
        this.searchLocation = this.searchLocation.bind(this);
        this.createShard = this.createShard.bind(this);
        this.scrapUrl = this.scrapUrl.bind(this);
        this.applyFilters = this.helperUploadShardService.filterFile;

        this.filteredPois = [];
    }

    ngOnInit() {
        this.resetLoadingStatus();

        this.fileSubscription = this.fileUploadService.filesToUpload$
            .flatMap((files) => {
                const file = files[files.length - 1];
                this.model.file = file;

                const emptyPOIs = { pois: [] };
                if (files.length > 0) {
                    this.isPictureChosen = true;

                    const exifData = file['exifdata'];
                    if (HelperUploadShardService.isValidExifData(exifData) === true) {
                        const coordinates: GPSCoordinates = HelperUploadShardService.getCoordinatesByExifData(exifData);
                        return this.shardService.getPoisByCoordinates$(coordinates);
                    } else {
                        return Observable.of(emptyPOIs);
                    }
                } else {
                    return Observable.of(emptyPOIs);
                }
            })
            .subscribe((response: any) => {
                this.filteredPois = response.pois;
            });
    }

    ngOnDestroy() {
        this.fileSubscription.unsubscribe();
    }

    // https://github.com/ng-bootstrap/ng-bootstrap/issues/698#issuecomment-307662011
    onFocus(e: Event) {
        e.stopPropagation();
        setTimeout(() => {
            const inputEvent: Event = new Event('input');
            e.target.dispatchEvent(inputEvent);
        }, 0);
    }

    searchFilteredPois = (text$: Observable<string>) => {
        return text$
            .debounceTime(ConfigurationService.durations.searchDelay)
            .distinctUntilChanged()
            .map((term) => {
                return this.filteredPois.filter((v) => {
                    return new RegExp(`^${term}`, 'i').test(v.label);
                });
            });
    }

    searchLocation(text$: Observable<string>) {
        const itemTypesBitMask = ConfigurationService.autocompleteRolesBitMask.city
                                 | ConfigurationService.autocompleteRolesBitMask.hotel
                                 | ConfigurationService.autocompleteRolesBitMask.attraction;

        return text$
            .debounceTime(ConfigurationService.durations.searchDelay)
            .distinctUntilChanged()
            .switchMap((term) => {
                return this.shardService.getAutocompleteDataObservable(term, this.i18nService.getCurrentLocale(), itemTypesBitMask)
                    .map((response) => {
                        return response.pois;
                    })
                    .catch(() => {
                        return Observable.of([]);
                    });
            });
    }

    formatLocation = (poi: { label: string, tagType: string }) => {
        this.selectedPoiIconClasses = this.getPoiClassesByTagType(poi.tagType);
        return poi.label;
    }

    scrapUrl(url: URL) {
        this.showLoadingProgress(this.labels.newShard.scrap.inProgress);
        this.shardService.buildShardFromUrl(url)
            .then((shardData) => {
                const file = HelperUploadShardService.dataStringToFile(shardData.imgBase64, 'temp.jpeg', 'image/jpeg');
                this.helperUploadShardService.filterFile(file).then((file) => {
                    this.fileUploadService.addToFilesToUpload(file);
                });

                this.model.description = shardData.description;
                this.model.inputUrl = shardData.inputUrl;
                this.model.siteName = shardData.siteName;

                this.showLoadingComplete(this.labels.newShard.scrap.complete);
            })
            .catch(() => {
                this.showLoadingError(this.labels.newShard.scrap.error);
            });
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.isLoadingSubmitButton = true;
        this.showLoadingProgress();

        const model = _.cloneDeep(this.model);
        const uploadFilename = ShardService.buildShardUploadFilename(model.file.name, this.userService.getUser().nid, uuid());

        this.shardService.uploadPhoto(model.file, uploadFilename)
            .then((() => {
                return this.createShard(model, uploadFilename);
            }))
            .then((response) => {
                this.finalizeUpload(response.shards[0]);
            })
            .catch((error) => {
                this.showLoadingError(this.labels.newShard.upload.error);
                this.isLoadingSubmitButton = false;
            });
    }

    dismiss(event: Event) {
        event.preventDefault();
        this.ngbActiveModal.dismiss();
    }

    removeFile(fileIndex: number) {
        this.fileUploadService.removeFileByIndex(fileIndex);
    }

    private finalizeUpload(newShard) {
        this.ngZone.runGuarded(() => {
            clearInterval(this.uploadInterval);
            this.showLoadingComplete(this.labels.newShard.upload.complete);

            const waitTime = 1000;
            const timeout = setTimeout(() => {
                this.isLoadingSubmitButton = false;
                this.ngbActiveModal.close(newShard);
            }, waitTime);
        });
    }

    private createShard(model, uploadFilename: string): Promise<any> {
        const shardArray: Shard[] = [this.createShardObject(model, uploadFilename)];
        return this.shardService.createShards(shardArray);
    }

    private createShardObject(model, uploadFilename: string): Shard {
        let shard = new Shard();

        shard.nearestPoiId = model.poi.neo4jId;
        shard.bit = ShardService.getShardBitByPoiBit(model.poi.bit);
        shard.description = model.description;
        shard.upLoadfileName = uploadFilename;
        shard.siteName = model.siteName;
        shard.inputUrl = model.inputUrl;

        return shard;
    }

    private getPoiClassesByTagType(tagType: string): string {
        const iconBase = 'wn-icon-' + tagType;
        return ['wn-icon', iconBase, iconBase + '-color'].join(' ');
    }

    // Possible refactor to common method:
    // Find a proper strategy after having dealt with the methods below
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

    // Possible refactor to common method: static method, returns progressBar object
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

    // Possible refactor to common method: static method, returns progressBar object
    private resetLoadingStatus(message?: string) {
        const progressBarDefault = {
            isAnimated: true,
            isStriped: true,
            isUploading: false,
            label: this.labels.newShard.upload.inProgress,
            type: null,
            value: 20
        };

        this.progressBar = progressBarDefault;

        if (message !== undefined) {
            this.progressBar.label = message;
        }
    }

    // Possible refactor to common method: Observable of progressBar object
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
