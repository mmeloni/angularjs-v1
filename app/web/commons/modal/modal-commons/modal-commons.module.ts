import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalButtonDismissComponent } from './modal-button-dismiss/modal-button-dismiss.component';
import { ModalService } from './modal.service';
import { ModalAvatarCropperModule } from '../modal-avatar-cropper/modal.avatar.cropper.module';

@NgModule({
    declarations: [
        ModalButtonDismissComponent
    ],
    exports: [
        ModalButtonDismissComponent
    ],
    imports: [
        NgbModule,
        ModalAvatarCropperModule
    ],
    providers: [
        ModalService
    ]
})
export class ModalCommonsModule { }
