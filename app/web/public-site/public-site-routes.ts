import { translationResolved } from '../../app.route-resolves';
import { HomePublicComponent } from './home-public/home-public.component';
import { PasswordRecoveryCodeCheckViewComponent } from './password-recovery/password-recovery-code-check-view/password-recovery-code-check-view.component';
import { PasswordRecoveryNewPasswordViewComponent } from './password-recovery/password-recovery-new-password-view/password-recovery-new-password-view.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const stateHomePublic = {
    component: HomePublicComponent,
    data: {
        public: true
    },
    name: 'homePublic',
    resolve: [
        translationResolved
    ],
    url: '/'
};

export const stateSignIn = {
    component: SignInComponent,
    data: {
        public: true
    },
    name: 'signIn',
    resolve: [
        translationResolved
    ],
    url: '/sign-in'
};

export const stateSignUp = {
    component: SignUpComponent,
    data: {
        public: true
    },
    name: 'signUp',
    resolve: [
        translationResolved
    ],
    url: '/sign-up'
};

export const statePasswordRecovery = {
    component: PasswordRecoveryComponent,
    data: {
        public: true
    },
    name: 'passwordRecovery',
    resolve: [
        translationResolved
    ],
    url: '/password-recovery'
};

export const statePasswordRecoveryCodeCheck = {
    component: PasswordRecoveryCodeCheckViewComponent,
    data: {
        public: true
    },
    name: 'codeCheck',
    // parent: 'passwordRecovery', // Doesn't work while the application is hybrid. Check password-recovery.component.ts.
    resolve: [
        translationResolved
    ],
    url: '/password-recovery/code-check?nid' // fake parent-child URL
};

export const statePasswordRecoveryNewPassword = {
    component: PasswordRecoveryNewPasswordViewComponent,
    data: {
        public: true
    },
    name: 'newPassword',
    // parent: 'passwordRecovery', // Doesn't work while the application is hybrid. Check password-recovery-code-check-view.component.ts.
    resolve: [
        translationResolved
    ],
    url: '/password-recovery/new-password?nid&code' // fake parent-child URL
};
