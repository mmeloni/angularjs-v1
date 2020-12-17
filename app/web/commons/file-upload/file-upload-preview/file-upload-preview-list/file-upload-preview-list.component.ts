import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'wn-file-upload-preview-list',
    templateUrl: 'file-upload-preview-list.component.html'
})

export class FileUploadPreviewListComponent {
    @Input() filesToPreview: File[];

    @Output() removeFromList = new EventEmitter<number>();

    remove(fileIndex: number) {
        this.removeFromList.next(fileIndex);
    }
}
