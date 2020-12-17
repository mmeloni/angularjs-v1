import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FileUploadService {
    private filesToUploadSource: Subject<File[]>;
    private files: File[] = [];

    filesToUpload$: Observable<File[]>;

    constructor() {
        this.filesToUploadSource = new Subject();
        this.filesToUpload$ = this.filesToUploadSource.asObservable();
    }

    addToFilesToUpload(file: File) {
        this.files.push(file);
        this.filesToUploadSource.next(this.files);
    }

    removeFileByIndex(fileIndex: number) {
        if (fileIndex !== -1) {
            this.files.splice(fileIndex, 1);
            this.filesToUploadSource.next(this.files);
        }
    }

    emptyFilesToUpload() {
        this.files = [];
    }
}
