import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { ConfigurationService } from '../config/configuration.service';
import { I18nService } from './i18n.service';

describe('i18nService:', () => {
    let mockBackend: MockBackend;
    let service: I18nService;
    let defaultLocale: string;
    const mockResponseData = { foo: 'bar' };

    beforeEach(async(() => {
        defaultLocale = ConfigurationService.defaultLocale;
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                I18nService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });

        mockBackend = getTestBed().get(MockBackend);

        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                        body: mockResponseData
                    }
                )
            ));
        });

        // It's important to get the service after the mockBackend is established,
        // so that its constructor can use the mocked Http.
        service = getTestBed().get(I18nService);
    }));

    it('should have an "init" method to asynchronously load data', async(() => {
        expect(typeof service.init).toBe('function');

        expect(service.getTranslationLabels()).toBeUndefined();
        expect(service.getTranslatedCountries()).toBeUndefined();
        service.init().then(() => {
            expect(service.getTranslationLabels()).toEqual(mockResponseData);
            expect(service.getTranslatedCountries()).toEqual(mockResponseData);
        });
    }));

    it('should have methods for setting and getting the "currentLocale" property', () => {
        expect(typeof service.getCurrentLocale).toBe('function');
        expect(typeof service.setCurrentLocale).toBe('function');

        expect(service.getCurrentLocale()).toBe(defaultLocale);
        expect(service.setCurrentLocale('XX')).toBe('XX');
        expect(service.getCurrentLocale()).toBe('XX');
    });

    it('should have a "loadTranslationLabels" method', () => {
        expect(typeof service.loadTranslationLabels).toBe('function');
    });

    it('should have a "loadCountries" method', () => {
        expect(typeof service.loadCountries).toBe('function');
    });

    it('should NOT define an interval to fetch data until https://github.com/angular/angular/issues/10127 gets fixed', (done) => {
        const spy = spyOn(global, 'setInterval');
        const serviceToo = getTestBed().get(I18nService);

        expect(spy).not.toHaveBeenCalled();
        done();
    });

    it('should have methods for setting and getting the "translationLabels" property', async(() => {
        expect(typeof service.getTranslationLabels).toBe('function');
        expect(typeof service.setTranslationLabels).toBe('function');

        service.init().then(() => {
            expect(service.getTranslationLabels()).toEqual(mockResponseData);
            expect(service.setTranslationLabels('XX')).toBe('XX');
            expect(service.getTranslationLabels()).toBe('XX');
        });
    }));

    it('should have methods for setting and getting the "translatedCountries" property', async(() => {
        expect(typeof service.getTranslatedCountries).toBe('function');
        expect(typeof service.setTranslatedCountries).toBe('function');

        service.init().then(() => {
            expect(service.getTranslatedCountries()).toEqual(mockResponseData);
            expect(service.setTranslatedCountries('XX')).toBe('XX');
            expect(service.getTranslatedCountries()).toBe('XX');
        });
    }));

    it('should have a "getCountries" method for getting the "translated', () => {
        expect(typeof service.getCountries).toBe('function');

        const mockLocale = 'XX';
        const spy = spyOn(service, 'loadCountries');
        service.getCountries(mockLocale);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(mockLocale);
    });

    describe('The "loadTranslationLabels" method:', () => {
        it('should return the cached translationLabels when a reload isn\'t needed', async(() => {
            service.init().then(() => {
                service.setTranslationLabels('XX');
                service.loadTranslationLabels().then((value) => {
                    expect(value).toEqual('XX');
                });
            });
        }));
    });

    describe('The "loadCountries" method:', () => {
        it('should return the cached translatedCountries when a reload isn\'t needed', async(() => {
            service.init().then(() => {
                service.setTranslatedCountries('XX');
                service.loadCountries().then((value) => {
                    expect(value).toEqual('XX');
                });
            });
        }));
    });
});
