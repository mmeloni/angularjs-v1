import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadModule } from '../../file-upload/file-upload.module';
import { ModalCommonsModule } from '../modal-commons/modal-commons.module';
import { ModalShardNewMultipleComponent } from './modal-shard-new-multiple.component';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';

@NgModule({
    declarations: [
        ModalShardNewMultipleComponent
    ],
    entryComponents: [
        ModalShardNewMultipleComponent
    ],
    imports: [
        ModalCommonsModule,
        FileUploadModule,
        FormsModule,
        CommonModule,
        NgbModule,
        UserInterfaceModule
    ]
})
export class ModalShardNewMultipleModule {
}
