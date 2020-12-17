import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UIRouterModule } from 'ui-router-ng2';

import { NotificationListComponent } from './notification-list/notification-list.component';
import { UserInterfaceModule } from '../../../../modules/user.interface/user.interface.module';

const components = [
    NotificationListComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        UIRouterModule,
        UserInterfaceModule
    ]
})
export class NotificationModule {
}
