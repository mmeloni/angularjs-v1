import { OnboardingStateService } from './onboarding-state.service';
import { STEPS_SETUP, STEPS_WELCOME } from './onboarding-steps';

describe('OnboardingStateService:', () => {
    let service: OnboardingStateService;
    beforeEach(() => {
        service = new OnboardingStateService();
    });

    it('should exist', () => {
        expect(service).toBeDefined();
    });

    it('should have a "init" method and load different sets of steps', () => {
        expect(typeof service.init).toBe('function');

        service.init('STEPS_WELCOME');
        expect(service.STEPS).toEqual(STEPS_WELCOME);

        service.init('STEPS_SETUP');
        expect(service.STEPS).toEqual(STEPS_SETUP);
    });
});
