import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { ConfigurationService } from '../../../shared/config/configuration.service';
import { Locale } from '../../../shared/config/locale.model';
import { SessionService } from '../../../shared/session/session.service';
import { I18nService } from '../../../shared/translation/i18n.service';
import { Testimonial } from './testimonial/testimonial.model';
import { ActionBarItem } from '../../../modules/user.interface/action-bar/action-bar-item/action-bar-item.model';

@Component({
    styleUrls: ['home-public.component.scss'],
    templateUrl: 'home-public.component.html'
})

export class HomePublicComponent implements OnInit {
    @Input() translationResolved;

    testimonials: Testimonial[] = [];
    statistics: ActionBarItem[];
    currentLocale: Locale;
    locales: Locale[] = ConfigurationService.locales;
    labels: any;
    isCookiesAccepted: boolean;

    constructor(
        private i18nService: I18nService,
        private sessionService: SessionService
    ) {
        //
    }

    ngOnInit() {
        this.initLabels();

        this.isCookiesAccepted = this.sessionService.getCookiesAccepted() || false;

        this.currentLocale = this.findLocaleByCode(this.i18nService.getCurrentLocale());
    }

    changeLocale(code: string) {
        this.currentLocale = this.findLocaleByCode(code);

        this.i18nService.loadTranslationLabels(code).then(() => {
            this.translationResolved = this.i18nService.getTranslationLabels();
            this.initLabels();
        });

        return false; // same as event.preventDefault()
    }

    cookiesAccept() {
        this.isCookiesAccepted = this.sessionService.setCookiesAccepted(true);
    }

    goToMailchimpSubscription(event: Event) {
        event.preventDefault();

        window.open('http://eepurl.com/bsGiKf');
    }

    private findLocaleByCode(code: string): Locale {
        return _.find(this.locales, { code: code });
    }

    private initLabels() {
        const cookiePolicy = {
            button: this.translationResolved.got_it,
            text: this.translationResolved.cookies
        };

        this.labels = {
            commons: this.translationResolved.publicSite.commons,
            cookiePolicy: cookiePolicy,
            homePage: this.translationResolved.publicSite.homePage
        };

        this.initTestimonials();
        this.initStatistics();
    }

    private initTestimonials() {
        const imageURLPrefix = '/assets/img/public';
        const testimonialAvatars = [
            'alessio-neri.jpg',
            'carlo-parisi.jpg',
            'giusi-carai.jpg'
        ];

        this.testimonials = [];

        _.forEach(this.labels.homePage.testimonials, (item, index) => {
            this.testimonials.push(item);
            this.testimonials[index].source.imageSrc = [imageURLPrefix, testimonialAvatars[index]].join('/');
        });
    }

    private initStatistics() {
        this.statistics = [
            {
                iconGlyph: 'flight',
                label: this.labels.homePage.statistics.airlines,
                value: 500
            },
            {
                iconGlyph: 'train',
                label: this.labels.homePage.statistics.rails,
                value: 2
            },
            {
                iconGlyph: 'car',
                label: this.labels.homePage.statistics.carRentals,
                value: 1
            },
            {
                iconGlyph: 'hotel',
                label: this.labels.homePage.statistics.hotels,
                value: 500000
            },
            {
                iconGlyph: 'place',
                label: this.labels.homePage.statistics.places,
                value: 1000000
            }
        ];
    }
}
