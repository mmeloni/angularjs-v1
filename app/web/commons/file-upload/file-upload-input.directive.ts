import { Directive, HostListener, Input, NgZone, OnInit } from '@angular/core';

import { FileUploadService } from './file-upload.service';

@Directive({
    selector: '[wnFileUploadInput]'
})
export class FileUploadInputDirective implements OnInit {
    // wnFileUploadInput === isMultiple
    @Input() wnFileUploadInput: boolean;
    @Input() wnFileUploadInputFilter?: Function;

    private fileInput: HTMLInputElement;

    constructor(
        private fileUploadService: FileUploadService,
        private ngZone: NgZone
    ) {
        //
    }

    ngOnInit() {
        this.fileInput = this.createHiddenFileInput();
        document.body.appendChild(this.fileInput);

        this.initFilterFunction();
    }

    @HostListener('click') onClick() {
        this.fileInput.click();

        return false; // event.preventDefault()
    }

    private initFilterFunction() {
        if (this.wnFileUploadInputFilter === undefined) {
            this.wnFileUploadInputFilter = (file) => {
                return Promise.resolve(file);
            };
        }
    }

    private createHiddenFileInput(): HTMLInputElement {
        let fileInput = document.createElement('input');

        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('style', 'display: none;');
        fileInput.setAttribute('accept', 'image/*'); // this may become an option in the future

        if (this.wnFileUploadInput === true) {
            fileInput.setAttribute('multiple', 'multiple');
        }

        fileInput.addEventListener('change', this.handleSelectedFiles.bind(this), false);

        return fileInput;
    }

    private handleSelectedFiles(event) {
        this.ngZone.run(() => {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                this.wnFileUploadInputFilter(files[i]).then((file) => {
                    this.fileUploadService.addToFilesToUpload(file);
                });
            }
        });
    }
}
