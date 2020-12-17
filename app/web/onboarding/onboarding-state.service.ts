import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { OnboardingStep } from './onboarding-step.model';
import { STEPS_SETUP, STEPS_WELCOME } from './onboarding-steps';

@Injectable()
export class OnboardingStateService {
    private firstStepIndex: number = 0;
    private currentStepIndexChangedSource: BehaviorSubject<number>;
    private currentStepUpdatedSource: BehaviorSubject<any>;
    private itemsToFollowLeftSource: BehaviorSubject<number>;

    STEPS: OnboardingStep[];
    currentStepIndexChanged$: Observable<any>;
    currentStepUpdated$: Observable<any>;
    itemsToFollowLeft$: Observable<any>;
    maxItemsToFollow: number = 5;

    constructor() {
        this.init('STEPS_WELCOME');

        // Observable number sources
        this.currentStepIndexChangedSource = new BehaviorSubject<number>(this.firstStepIndex);

        // TODO: define 'OnboardingWelcomeStep' type
        this.currentStepUpdatedSource = new BehaviorSubject<OnboardingStep>(this.STEPS[this.firstStepIndex]);

        this.itemsToFollowLeftSource = new BehaviorSubject<number>(this.maxItemsToFollow);

        // Observable streams
        this.currentStepIndexChanged$ = this.currentStepIndexChangedSource.asObservable();
        this.currentStepUpdated$ = this.currentStepUpdatedSource.asObservable();
        this.itemsToFollowLeft$ = this.itemsToFollowLeftSource.asObservable();
    }

    init(stepSet?: string) {
        switch (stepSet) {
            case 'STEPS_WELCOME':
                this.STEPS = STEPS_WELCOME;
                break;
            case 'STEPS_SETUP':
                this.STEPS = STEPS_SETUP;
                break;
            default:
                this.STEPS = STEPS_WELCOME;
                break;
        }

        this.decorateSteps();
    }

    // Service message commands
    updateCurrentStep() {
        const newStepIndex = this.currentStepIndexChangedSource.getValue() + 1;
        this.updateIndexAndStep(newStepIndex);
    }

    resetCurrentStep() {
        const newStepIndex = this.firstStepIndex;
        this.updateIndexAndStep(newStepIndex);
    }

    updateItemsToFollowLeft(backwards) {
        const step = (backwards === true) ? -1 : 1;
        const newItemsToFollowLeft = this.itemsToFollowLeftSource.getValue() + step;
        this.itemsToFollowLeftSource.next(newItemsToFollowLeft);
    }

    resetItemsToFollowLeft() {
        this.itemsToFollowLeftSource.next(this.maxItemsToFollow);
    }

    private updateIndexAndStep(newStepIndex) {
        this.currentStepIndexChangedSource.next(newStepIndex);
        this.currentStepUpdatedSource.next(this.STEPS[newStepIndex]);
    }

    private decorateSteps() {
        for (let i in this.STEPS) {
            if (this.STEPS[i] !== undefined) {
                const radix = 10;
                this.STEPS[i]['index'] = parseInt(i, radix);
            }
        }
    }
}
