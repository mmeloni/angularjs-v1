import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalCommonsModule } from '../modal-commons/modal-commons.module';
import { LinkedPlaceInfoComponent } from './linked-place-info/linked-place-info.component';
import { ModalShardDetailComponent } from './modal-shard-detail.component';
import { ShardCommentsModule } from './shard-comments/shard-comments.module';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';

@NgModule({
    declarations: [
        ModalShardDetailComponent,
        LinkedPlaceInfoComponent
    ],
    entryComponents: [
        ModalShardDetailComponent
    ],
    imports: [
        CommonModule,
        ModalCommonsModule,
        UserInterfaceModule,
        ShardCommentsModule
    ]
})
export class ModalShardDetailModule { }
