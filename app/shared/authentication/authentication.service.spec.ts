import { TestBed, async, getTestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { Observable } from 'rxjs/Observable';

import { StateService } from 'ui-router-ng2';

// import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService:', () => {
    // let mockBackend: MockBackend;
    let service: AuthenticationService;
    // const mockResponseData = { foo: 'bar' };
    const sessionServiceStub = {};
    const userServiceStub = {};
    const stateServiceStub = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                AuthenticationService,
                { provide: SessionService, useValue: sessionServiceStub },
                { provide: UserService, useValue: userServiceStub },
                { provide: StateService, useValue: stateServiceStub }
                // MockBackend,
                // BaseRequestOptions,
                // {
                //     deps: [MockBackend, BaseRequestOptions],
                //     provide: Http,
                //     useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                //         return new Http(backend, defaultOptions);
                //     }
                // }
            ]
        });

        // mockBackend = getTestBed().get(MockBackend);

        // mockBackend.connections.subscribe((connection: MockConnection) => {
        //     connection.mockRespond(new Response(
        //         new ResponseOptions({
        //                 body: mockResponseData
        //             }
        //         )
        //     ));
        // });

        // It's important to get the service after the mockBackend is established,
        // so that its constructor can use the mocked Http.
        service = getTestBed().get(AuthenticationService);
    }));

    it('should have a "signIn$()" method to sign the user in', () => {
        expect(typeof service.signIn$).toBe('function');
    });
});
