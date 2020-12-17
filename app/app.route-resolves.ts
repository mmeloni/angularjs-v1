// This file is **only** for UI-Router 2 resolve definitions used in more than one state subtree

import { I18nService } from './shared/translation/i18n.service';

export const translationResolved = {
    deps: [ I18nService ],
    resolveFn: (i18nService) => {
        return i18nService.init().then(() => {
            return i18nService.getTranslationLabels();
        });
    },
    token: 'translationResolved'
};

export const translatedCountriesResolved = {
    deps: [ I18nService ],
    resolveFn: (i18nService) => {
        return i18nService.init().then(() => {
            return i18nService.getTranslatedCountries();
        });
    },
    token: 'translatedCountriesResolved'
};
