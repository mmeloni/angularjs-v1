import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

@Component({
    selector: 'wn-profile-pic-cropper',
    styleUrls: [ 'user.profile.pic.cropper.component.scss' ],
    template: `
        <div class="profile-pic-cropper">
            <h1>Select picture</h1>
            <img-cropper #cropper [image]="data" [settings]="cropperSettings"></img-cropper>
            <input class="hidden actual-input" type="file" (change)="fileChangeListener($event)">
            <button class="btn btn-primary btn-upload" (click)="openFileDialog()">
                Select picture&hellip;
            </button>
            <hr />
            <button class="btn btn-success btn-done" (click)="onDone()">
                Done
            </button>
        </div>


    `
})
export class UserProfilePicCropperComponent {
    @Output() onCropped: EventEmitter<string | false> = new EventEmitter();

    @ViewChild('cropper') cropper: ImageCropperComponent;

    public data: any;

    public cropperSettings: CropperSettings;

    constructor(private el: ElementRef) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        this.data = {};
    }

    public openFileDialog() {
        this.el.nativeElement.querySelector('input.actual-input').click();
    }

    public fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[ 0 ];
        const myReader: FileReader = new FileReader();

        myReader.onloadend = (loadEvent: any) => {
            image.src = loadEvent.target.result;
            this.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    public onDone() {
        if (this.data && this.data.image) {
            this.onCropped.emit(this.data.image);
        } else {
            this.onCropped.emit(false);
        }
    }

}
