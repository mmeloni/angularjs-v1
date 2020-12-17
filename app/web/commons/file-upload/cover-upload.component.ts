import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'wn-cover-upload',
    templateUrl: './cover-upload.component.html'
})
export class CoverUploadComponent implements OnDestroy, OnInit {
    @Input() applyFilters: any;
    @Input() label: any;

    @Output() newCover = new EventEmitter<any>();

    private fileSubscription: Subscription;

    constructor(
        private fileUploadService: FileUploadService
    ) {
        //
    }

    ngOnInit() {
        this.fileSubscription = this.fileUploadService.filesToUpload$
            .finally(() => {
                this.fileUploadService.emptyFilesToUpload();
            })
            .subscribe((filesToUpload: File[]) => {
                this.newCover.next(filesToUpload.pop());
            });
    }

    ngOnDestroy() {
        if (this.fileSubscription !== undefined) {
            this.fileSubscription.unsubscribe();
        }
    }
}
