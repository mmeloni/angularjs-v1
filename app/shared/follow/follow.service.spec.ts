import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { FollowService } from './follow.service';

describe('FollowService:', () => {
    let mockBackend: MockBackend;
    let service: FollowService;
    const mockResponseData: any = { foo: 'bar' };
    const sessionServiceStub = {
        getToken: () => { return 'token'; }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                FollowService,
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
            const requestURL = connection.request.url;
            let mockResponseDataBody = {
                body: mockResponseData
            };

            if (requestURL.includes('/follow')) {
                mockResponseDataBody.body = true;
            } else if (requestURL.includes('/unfollow')) {
                mockResponseDataBody.body = false;
            }

            connection.mockRespond(new Response(
                new ResponseOptions(mockResponseDataBody)
            ));
        });

        // It's important to get the service after the mockBackend is established,
        // so that its constructor can use the mocked Http.
        service = getTestBed().get(FollowService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof FollowService).toBe(true);
    });

    it('should have a "toggleFollow" method to follow / unfollow a target by targetId', async(() => {
        expect(typeof service.toggleFollow).toBe('function');

        service.toggleFollow(1, true).then((response) => {
            expect(response).toBe(false);
        });

        service.toggleFollow(1, false).then((response) => {
            expect(response).toBe(true);
        });
    }));
});
