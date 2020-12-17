import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIRouterModule } from 'ui-router-ng2';

import { ModalPlanModule } from '../commons/modal/modal-plan/modal-plan.module';
import { NavbarModule } from '../commons/navbar/navbar.module';
import { AmenitiesComponent } from './hotel-view/amenities-component/amenities.component';
import { AmenityItemComponent } from './hotel-view/amenities-component/amenity-item-component/amenity-item.component';
import { CoverComponent } from './hotel-view/hotel-cover-component/cover.component';
import { HotelViewComponent } from './hotel-view/hotel-view.component';
import { TextCollapsedComponent } from './hotel-view/text-collapsed-component/text-collapsed.component';
import { UserInterfaceModule } from '../../modules/user.interface/user.interface.module';

@NgModule({
    declarations: [
        AmenitiesComponent,
        AmenityItemComponent,
        CoverComponent,
        HotelViewComponent,
        TextCollapsedComponent
    ],
    entryComponents: [
        HotelViewComponent
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        UserInterfaceModule,
        NgbModule,
        NavbarModule,
        ModalPlanModule
    ]
})
export class HotelModule { }
