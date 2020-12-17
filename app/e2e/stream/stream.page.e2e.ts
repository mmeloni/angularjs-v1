import { browser, by, Config, element, ElementFinder } from 'protractor';

import { config } from '../../config/protractor.conf';

export class StreamPageE2e {

    private e2eConfig: Config = config;
    private pageWrapper: ElementFinder = element(by.binding('.stream-page'));
    private grid: ElementFinder = element(by.binding('.stream-page'));

    public get() {
        return browser.get(this.e2eConfig.baseUrl);
    }

    public getPageWrapper(): ElementFinder {
        return this.pageWrapper;
    }

    public getPageGrid(): ElementFinder {
        return this.grid;
    }

}
