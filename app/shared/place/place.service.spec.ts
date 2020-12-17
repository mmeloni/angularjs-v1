import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { PlaceService } from './place.service';

describe('PlaceService:', () => {
    let mockBackend: MockBackend;
    let service: PlaceService;
    let defaultLocale: string;
    const mockResponseData = { foo: 'bar' };
    const sessionServiceStub = {
        getToken: () => { return 'token'; }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                PlaceService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                {
                    provide: SessionService, useValue: sessionServiceStub
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
        service = getTestBed().get(PlaceService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof PlaceService).toBe(true);
    });

    it('should have a "loadPlaceFullData" method to load place data', async(() => {
        expect(typeof service.loadPlaceFullData).toBe('function');

        service.loadPlaceFullData(1).then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "getSuggestedPlaces" method to get suggested places', async(() => {
        expect(typeof service.getSuggestedPlaces).toBe('function');

        service.getSuggestedPlaces().then((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));
});
