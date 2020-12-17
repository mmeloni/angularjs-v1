import { translationResolved } from '../../app.route-resolves';
import { PlaceService } from '../../shared/place/place.service';
import { SessionService } from '../../shared/session/session.service';
import { UserService } from '../../shared/user/user.service';
import { OnboardingViewComponent } from './onboarding-view/onboarding-view.component';

export const stateOnboardingWelcome = {
    component: OnboardingViewComponent,
    name: 'onboarding',
    onEnter: requireAuthentication,
    resolve: [
        translationResolved,
        {
            resolveFn: () => { return 'welcome'; },
            token: 'viewMode'
        }
    ],
    url: '/onboarding/welcome'
};

// Refactor with parent state and inherited resolve once the routing (or the app) is full NG2
export const stateOnboardingSetup = {
    component: OnboardingViewComponent,
    name: 'onboarding-setup',
    resolve: [
        translationResolved,
        {
            resolveFn: () => { return 'setup'; },
            token: 'viewMode'
        },
        {
            deps: [PlaceService],
            resolveFn: (placeService) => {
                return placeService.getSuggestedPlaces().then((response) => {
                    return response;
                });
            },
            token: 'placesResolved'
        },
        {
            deps: [UserService],
            resolveFn: (userService) => {
                return userService.getPopularProfiles().then((response) => {
                    return response;
                });
            },
            token: 'usersResolved'
        }
    ],
    url: '/onboarding/setup'
};

function requireAuthentication() {
    // let $state = transition.router.stateService;
    // let authSvc = transition.injector().get(SessionService); // use AuthenticationService once ported to NG2
    // const token = authSvc.getToken();
    // console.log('requireAuthentication transition hook - currently not working: https://github.com/ui-router/ng1-to-ng2/issues/28');
    // if (token === null) {
    //     $state.target('login');
    // }
}
