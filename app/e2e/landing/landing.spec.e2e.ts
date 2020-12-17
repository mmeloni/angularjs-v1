import { browser } from 'protractor';

import { LandingPage } from './landing.page.e2e';

describe('wayonara homepage', () => {

    const landingPage = new LandingPage();

    beforeEach(() => {
        landingPage.get()
            .then((page) => {
                return page;
            })
            .catch((error) => {
                return error;
            });
    });

    it('should have a sign in button with Sign in text', () => {
        landingPage.getSignInButtonText()
            .then((signinButtonText) => {
                expect<any>(signinButtonText).toEqual('Sign in');
            })
            .catch((error) => {
                return error;
            });
    });

    it('should have a sign up button with Sign up text', () => {
        landingPage.getSignUpButtonText()
            .then((signupButtonText) => {
                expect<any>(signupButtonText).toEqual('Sign up');
            })
            .catch((error) => {
                return error;
            });
    });

    it('should have a login form present after clicking on sign in button', async () => {
        landingPage.getSignUpButton().click()
                .then((button) => {
                    return landingPage.getFormLogin();
                })
                .then((formLogin) => {
                    expect<any>(formLogin.isPresent()).toBe(true);
                })
                .catch((error) => {
                    return error;
                });
    });
});
