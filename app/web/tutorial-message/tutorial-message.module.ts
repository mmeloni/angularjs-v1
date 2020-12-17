import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TutorialMessageComponent } from './tutorial-message.component';
import { TutorialMessageService } from './tutorial-message.service';

@NgModule({
    declarations: [
        TutorialMessageComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        TutorialMessageService
    ]
})
export class TutorialMessageModule {
    //
}
