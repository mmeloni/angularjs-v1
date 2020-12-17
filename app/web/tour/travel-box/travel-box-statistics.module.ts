import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TravelBoxStatisticsComponent } from './travel-box-statistics.component';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

const toExport = [
    TravelBoxStatisticsComponent
];

@NgModule({
    declarations: toExport,
    exports: toExport,
    imports: [
        CommonModule,
        UserInterfaceModule
    ]
})
export class TravelBoxStatisticsModule { }
