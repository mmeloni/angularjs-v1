// https://angular.io/docs/ts/latest/guide/style-guide.html#03-03
import { OnboardingStepNext } from './onboarding-step-next.model';

export class OnboardingStep {
    imgURL: string;
    index?: number;
    next: OnboardingStepNext;
    text: string;
    title: string;
}
