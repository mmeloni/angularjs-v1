import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import 'rxjs/add/operator/first';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { TourService } from './tour.service';

describe('TourService:', () => {
    let mockBackend: MockBackend;
    let service: TourService;

    const mockResponseData = { foo: 'bar' };

    const mockTour = {
        description: 'bar',
        shardsId: [1, 0],
        title: 'foo'
    };

    const sessionServiceStub = {
        getToken: () => { return 'token'; }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                TourService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                { provide: SessionService, useValue: sessionServiceStub }
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
        service = getTestBed().get(TourService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof TourService).toBe(true);
    });

    it('should have a "createTour$" observable to create a Tour', async(() => {
        expect(typeof service.createTour$).toBe('function');

        // no need to unsubscribe since we only use the first emission, then the Observable completes.
        service.createTour$(mockTour).first().subscribe((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));

    it('should have a "updateTour$" observable to update a Tour', async(() => {
        expect(typeof service.updateTour$).toBe('function');

        // no need to unsubscribe since we only use the first emission, then the Observable completes.
        service.updateTour$(mockTour).first().subscribe((response) => {
            expect(response).toEqual(mockResponseData);
        });
    }));
});
