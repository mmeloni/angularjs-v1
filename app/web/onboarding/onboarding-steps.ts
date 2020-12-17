import { OnboardingStep } from './onboarding-step.model';

export const STEPS_WELCOME: OnboardingStep[] = [
    {
        imgURL: '/assets/img/onboarding/welcome/onboarding-passport.png',
        next: {
            text: ''
        },
        text: '',
        title: ''
    },
    {
        imgURL: '/assets/img/onboarding/welcome/onboarding-shard.png',
        next: {
            text: ''
        },
        text: '',
        title: ''
    },
    {
        imgURL: '/assets/img/onboarding/welcome/onboarding-shard-plan.png',
        next: {
            text: ''
        },
        text: '',
        title: ''
    },
    {
        imgURL: '/assets/img/onboarding/welcome/onboarding-board.png',
        next: {
            text: ''
        },
        text: '',
        title: ''
    },
    {
        imgURL: '/assets/img/onboarding/welcome/onboarding-shard-tour.png',
        next: {
            state: 'onboarding-setup',
            text: ''
        },
        text: '',
        title: ''
    }
];

export const STEPS_SETUP: OnboardingStep[] = [
        {
            imgURL: '',
            next: {
                text: ''
            },
            text: '',
            title: ''
        },
        {
            imgURL: '',
            next: {
                text: ''
            },
            text: '',
            title: ''
        },
        {
            imgURL: '',
            next: {
                state: 'stream',
                text: ''
            },
            text: '',
            title: ''
        }
];
