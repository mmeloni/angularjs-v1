import { Component, Input } from '@angular/core';

import { WizardStepCounterOptions } from './wizard-step-counter-options.model';

@Component({
    selector: 'wn-wizard-step-counter',
    templateUrl: 'wizard-step-counter.component.html'
})
export class WizardStepCounterComponent {
    @Input() options: WizardStepCounterOptions;
}
