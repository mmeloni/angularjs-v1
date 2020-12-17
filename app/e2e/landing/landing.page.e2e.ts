import { browser, by, element } from 'protractor';

import { config } from '../../config/protractor.conf';

export class LandingPage {

    private e2eConfig = config;
    private signInButton = element(by.binding('translation.log_in'));
    private signUpButton = element(by.binding('vmLanding.translation.signUp'));
    private formLogin = element(by.id('formLogin'));

    get() {
        return browser.get(this.e2eConfig.baseUrl);
    }

    getSignInButtonText() {
        return this.signInButton.getText();
    }

    getSignUpButtonText() {
        return this.signUpButton.getText();
    }

    getSignUpButton() {
        return this.signUpButton;
    }

    getFormLogin() {
        return this.formLogin;
    }
}
