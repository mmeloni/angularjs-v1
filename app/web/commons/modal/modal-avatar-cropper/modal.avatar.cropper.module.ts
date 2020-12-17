import { UserProfilePicCropperComponent } from './user.profile.pic.cropper.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ng2-img-cropper';

@NgModule({
    declarations: [
        UserProfilePicCropperComponent
    ],
    entryComponents: [
        UserProfilePicCropperComponent
    ],
    imports: [ CommonModule, ImageCropperModule ],
    providers: []
})
export class ModalAvatarCropperModule {
}
