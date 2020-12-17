import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { UIRouterModule } from 'ui-router-ng2';

import { NavbarOnboardingComponent }   from './navbar-onboarding/navbar-onboarding.component';
import { WizardStepCounterComponent } from './navbar-onboarding/wizard-step-counter/wizard-step-counter.component';
import { OnboardingStateService } from './onboarding-state.service';
import { OnboardingCardPlaceComponent } from './onboarding-view/onboarding-setup/onboarding-card-place/onboarding-card-place.component';
import { OnboardingCardUserComponent } from './onboarding-view/onboarding-setup/onboarding-card-user/onboarding-card-user.component';
import { OnboardingSetupComponent }   from './onboarding-view/onboarding-setup/onboarding-setup.component';
import { OnboardingViewComponent }   from './onboarding-view/onboarding-view.component';
import { UserInterfaceModule } from '../../modules/user.interface/user.interface.module';

// import { stateOnboardingSetup, stateOnboardingWelcome } from './onboarding-routes';

@NgModule({
    declarations: [
        NavbarOnboardingComponent,
        OnboardingSetupComponent,
        OnboardingViewComponent,
        WizardStepCounterComponent,
        OnboardingCardPlaceComponent,
        OnboardingCardUserComponent
    ],
    // WARNING: check if entryComponents is still necessary once the application - or the routing - is full-NG2
    entryComponents: [
        OnboardingViewComponent
    ],
    imports: [
        CommonModule,
        UserInterfaceModule
        // WARNING: try to uncomment once the application - or the routing - is full-NG2 and we can define routes in the various feature modules instead of a single route definition file
        // UIRouterModule.forChild({
        //     states: [
        //         stateOnboardingWelcome,
        //         stateOnboardingSetup
        //     ]
        // }),
    ],
    providers: [
        OnboardingStateService
    ]
})
export class OnboardingModule {
    //
}
