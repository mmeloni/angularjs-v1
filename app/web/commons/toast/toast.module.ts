import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../../../shared/config/configuration.service';
import { ToastActionableComponent } from './toast-actionable/toast-actionable.component';
import { ToastService } from './toast.service';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

const components = [
    ToastActionableComponent
];

@NgModule({
    declarations: components,
    entryComponents: components,
    exports: [],
    imports: [
        ToastrModule.forRoot({
            enableHtml: true,
            // extendedTimeOut: 0, // debug
            positionClass: 'toast-bottom-center',
            // timeOut: 0 // debug
            timeOut: ConfigurationService.durations.toast
        }),
        CommonModule,
        UserInterfaceModule
    ],
    providers: [
        ToastService,
        ToastrService
    ]
})
export class ToastModule {
    //
}
