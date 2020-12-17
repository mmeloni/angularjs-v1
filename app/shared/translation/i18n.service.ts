import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import * as moment from 'moment';

import { ConfigurationService } from '../config/configuration.service';

declare let webpackGlobalVars: any;

@Injectable()
export class I18nService {
    private currentLocale: string;
    private interval: any;
    private storage: any;
    private timeToReload = {
        countries: false,
        labels: false
    };
    private translationLabels: any;
    private translatedCountries: any;

    constructor(private http: Http) {
        this.storage = localStorage;
        this.timeToReload.labels = true;
        this.timeToReload.countries = true;
    }

    init(): Promise<any> {
        // Ugly, despicable, horrid, inevitable hack: https://github.com/angular/angular/issues/10127
        if (typeof webpackGlobalVars.isTest === 'undefined' && typeof this.interval === 'undefined') {
            const intervalDuration = 3600000;
            this.interval = Observable.interval(intervalDuration).subscribe((tick) => {
                this.updateAll();
            });
        }
        return this.updateAll();
    }

    setTranslationLabels(newLabels) {
        this.translationLabels = newLabels;
        return this.getTranslationLabels();
    }

    getTranslationLabels() {
        return this.translationLabels;
    }

    setCurrentLocale(newLocale) {
        // save some $localStorage r/w
        if (this.currentLocale !== newLocale) {
            this.currentLocale = newLocale;
            this.storage.currentLocale = newLocale;

            moment.locale(newLocale); // setup moment localization
        }
        return this.getCurrentLocale();
    }

    getCurrentLocale() {
        if (this.currentLocale === undefined && this.storage.currentLocale === undefined) {
            this.setCurrentLocale(ConfigurationService.defaultLocale);
        } else if (this.currentLocale === undefined) {
            this.setCurrentLocale(this.storage.currentLocale);
        }
        return this.currentLocale;
    }

    setTranslatedCountries(newCountries) {
        this.translatedCountries = newCountries;
        return this.getTranslatedCountries();
    }

    getTranslatedCountries() {
        return this.translatedCountries;
    }

    loadTranslationLabels(locale?: string): Promise<any> {
        locale = locale || this.getCurrentLocale();
        if (this.needsReload(locale, this.getTranslationLabels, this.timeToReload.labels)) {
            this.setCurrentLocale(locale);
            return this.getLangFile(locale).then((response) => {
                return this.setTranslationLabels(response);
            });
        } else {
            return Promise.resolve(this.getTranslationLabels());
        }
    }

    loadCountries(locale?: string): Promise<any> {
        locale = locale || this.getCurrentLocale();
        if (this.needsReload(locale, this.getTranslatedCountries, this.timeToReload.countries)) {
            this.setCurrentLocale(locale);
            return this.loadCountriesByLocale(locale).then((response) => {
                return this.setTranslatedCountries(response);
            });
        } else {
            return Promise.resolve(this.getTranslatedCountries());
        }
    }

    getCountries(locale) {
        this.loadCountries(locale);
    }

    private getLangFile(language): Promise<any> {
        return this.http.get(ConfigurationService.api._GET_LANG_FILE.replace(':locale', language), this.getOptions(language))
            .toPromise()
            .then(this.extractData)
            .catch((error) => {
                console.error(error);
            });
    }

    private loadCountriesByLocale(language): Promise<any> {
        return this.http.get(ConfigurationService.api._RETRIEVE_COUNTRIES.replace(':locale', language), this.getOptions(language))
            .toPromise()
            .then(this.extractData);
    }

    private needsReload(locale, checkItemFn, enforceReload) {
        if (enforceReload === true) {
            return true;
        } else {
            return locale !== this.getCurrentLocale() || checkItemFn === undefined;
        }
    }

    private extractData(response: Response) {
        let body = response.json();
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        return body || {};
    }

    private getOptions(language): RequestOptions {
        let headers: Headers = new Headers({});
        headers.append('content-type', 'application/json; charset=utf-8');

        let options = new RequestOptions({ headers: headers });
        options.headers = headers; // TODO: is this line redundant?

        return options;
    }

    private updateAll(): Promise<any> {
        return Promise.all([ this.loadTranslationLabels(), this.loadCountries() ])
            .then(() => {
                this.timeToReload.labels = false;
                this.timeToReload.countries = false;
            });
    }
}
