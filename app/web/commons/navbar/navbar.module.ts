import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIRouterModule } from 'ui-router-ng2';

import { ModalShardNewModule } from '../modal/modal-shard-new/modal-shard-new.module';
import { NavbarSocialComponent } from './navbar-social/navbar-social.component';
import { NumberToLimitedPipe } from './navbar-social/number-to-limited.pipe';
import { OmnisearchModule } from './navbar-social/omnisearch/omnisearch.module';
import { ShardNewOpenDirective } from './navbar-social/shard-new-open.directive';
import { HelperNotificationService } from './notification/helper-notification.service';
import { NotificationModule } from './notification/notification.module';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

const toExport = [
    NavbarSocialComponent,
    NumberToLimitedPipe,
    ShardNewOpenDirective
];

@NgModule({
    declarations: toExport,
    exports: toExport,
    imports: [
        NgbModule,
        UserInterfaceModule,
        UIRouterModule,
        FormsModule,
        CommonModule,
        NotificationModule,
        OmnisearchModule,
        ModalShardNewModule
    ],
    providers: [
        HelperNotificationService
    ]
})
export class NavbarModule {
    //
}
