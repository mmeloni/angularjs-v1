import { Component, Input, OnInit } from '@angular/core';

import { OnboardingStateService } from '../onboarding-state.service';
import { WizardStepCounterOptions } from './wizard-step-counter/wizard-step-counter-options.model';

import * as _ from 'lodash';

@Component({
    selector: 'wn-navbar-onboarding',
    styleUrls: ['./navbar-onboarding.component.scss'],
    templateUrl: 'navbar-onboarding.component.html'
})
export class NavbarOnboardingComponent implements OnInit {
    @Input() translation: any;

    wizardStepCounterOptions: WizardStepCounterOptions;

    constructor(
        private onboardingStateService: OnboardingStateService
    ) {
        //
    }

    ngOnInit() {
        const totalSteps = _.isUndefined(this.onboardingStateService.STEPS) ? 0 : this.onboardingStateService.STEPS.length;
        this.wizardStepCounterOptions = {
            currentStepNumber: 1,
            textIntro: this.translation.step,
            textSeparator: this.translation.of,
            totalSteps: totalSteps
        };

        this.onboardingStateService.currentStepIndexChanged$.subscribe((currentStepIndex) => {
            this.wizardStepCounterOptions.currentStepNumber = ++currentStepIndex; // good old "array index vs human readable"
        });
    }

    backToStart(e) {
        e.preventDefault();
        // uncomment the following line for ease fo debugging and testing
        // this.onboardingStateService.resetCurrentStep();
    }
}
