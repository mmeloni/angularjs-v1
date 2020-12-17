import { Config } from 'protractor';

// test environment forced on config-stag, restore to correct environment when full discussed question
const envConfig = require('../../../app/config/config-stag.json');

export const config: Config = {
    SELENIUM_PROMISE_MANAGER: false,

    baseUrl: envConfig.siteURL,

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            // disable-gpu is needed to avoid tab breaking due to possible memory shortage in local dev environment
            args: [ '--headless', '--disable-gpu', '--window-size=1024x768' ]
        }
    },

    directConnect: true,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true
    },

    specs: [
        '../e2e/**/*.spec.e2e.js'
    ],

    useAllAngular2AppRoots: true
};
