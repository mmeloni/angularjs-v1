import { NgZone } from '@angular/core';
import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { S3, config } from 'aws-sdk';
import { SessionService } from '../session/session.service';
import { UploadService } from './upload.service';

describe('UploadService:', () => {
    let mockBackend: MockBackend;
    let service: UploadService;
    const mockResponseData = { foo: 'bar' };
    const sessionServiceStub = {
        getToken: () => { return 'token'; }
    };

    beforeEach( async(() => {
        const ngZoneStub = {
            runGuarded: (callback: Function) => {
                callback();
            }
        };

        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                UploadService,
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
        service = getTestBed().get(UploadService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof UploadService).toBe(true);
    });
});
