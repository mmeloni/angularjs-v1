import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastModule } from '../../toast/toast.module';
import { ModalCommonsModule } from '../modal-commons/modal-commons.module';
import { HelperPlanService } from './helper-plan.service';
import { ModalPlanBoardItemComponent } from './modal-plan-board-item/modal-plan-board-item.component';
import { ModalPlanFormComponent } from './modal-plan-form/modal-plan-form.component';
import { ModalPlanShardComponent } from './modal-plan-shard/modal-plan-shard.component';
import { ModalPlanSuggestedComponent } from './modal-plan-suggested/modal-plan-suggested.component';
import { ModalPlanTourItemComponent } from './modal-plan-tour-item/modal-plan-tour-item.component';
import { ModalPlanComponent } from './modal-plan.component';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';

@NgModule({
    declarations: [
        ModalPlanComponent,
        ModalPlanBoardItemComponent,
        ModalPlanTourItemComponent,
        ModalPlanSuggestedComponent,
        ModalPlanFormComponent,
        ModalPlanShardComponent
    ],
    entryComponents: [
        ModalPlanComponent
    ],
    imports: [
        CommonModule,
        UserInterfaceModule,
        FormsModule,
        ToastModule,
        ModalCommonsModule
    ],
    providers: [
        HelperPlanService
    ]
})
export class ModalPlanModule {
}
