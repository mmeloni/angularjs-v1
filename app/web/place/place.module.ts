import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIRouterModule } from 'ui-router-ng2';

import { ModalPlanModule } from '../commons/modal/modal-plan/modal-plan.module';
import { ModalShardDetailModule } from '../commons/modal/modal-shard-detail/modal-shard-detail.module';
import { NavbarModule } from '../commons/navbar/navbar.module';
import { AttractionAndPlaceViewComponent } from './attraction-and-place-view/attraction-and-place-view.component';
import { UserInterfaceModule } from '../../modules/user.interface/user.interface.module';

@NgModule({
    declarations: [
        AttractionAndPlaceViewComponent
    ],
    entryComponents: [
        AttractionAndPlaceViewComponent
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        UserInterfaceModule,
        NgbModule,
        NavbarModule,
        ModalPlanModule,
        ModalShardDetailModule
    ]
})
export class PlaceModule { }
