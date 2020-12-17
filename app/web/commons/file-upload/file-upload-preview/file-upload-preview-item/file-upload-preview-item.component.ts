import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'wn-file-upload-preview-item',
    styleUrls: ['file-upload-preview-item.component.scss'],
    templateUrl: 'file-upload-preview-item.component.html'
})

export class FileUploadPreviewItemComponent {
    @Input() file: File;
    @Input() fileId: number;
    @Input() filePreviewStyle: string;
    @Input() containerStyle?: any;
    @Input() cssClasses: string;

    @Output() removeFromList = new EventEmitter<number>();

    remove() {
        this.removeFromList.next(this.fileId);
    }
}
