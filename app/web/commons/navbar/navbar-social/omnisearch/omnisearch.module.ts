import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OmnisearchResultComponent } from './omnisearch-result/omnisearch-result.component';
import { OmnisearchComponent } from './omnisearch.component';
import { UserInterfaceModule } from '../../../../../modules/user.interface/user.interface.module';

const components = [
    OmnisearchComponent,
    OmnisearchResultComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        UserInterfaceModule
    ],
    providers: []
})
export class OmnisearchModule {
    //
}
