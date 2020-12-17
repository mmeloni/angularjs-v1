import { TestBed, inject } from '@angular/core/testing';
import { BoardsProvider } from './boards.provider';
import { Network } from '../network';
import { CachableNetwork } from '../network';
import {
    HttpModule,
    Response,
    BaseRequestOptions,
    Http,
    ResponseOptions,
    RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Boards } from '../../modules/board/types';

describe('BoardsProvider', () => {

    /**
     * create the TestBed configuration providing a backend infrastructure
     * and the service provider to be tested
     */
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                BaseRequestOptions,
                // the mock backend infrastructure
                {
                    provide: Http,
                    deps: [ MockBackend, BaseRequestOptions ],
                    useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backendInstance, defaultOptions)
                },
                BoardsProvider // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ BoardsProvider ], (service: BoardsProvider) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the inheritance of the provider, it could inherit from Network and CachableNetwork
     */
    it('should extend Network and CachedNetwork', inject([ BoardsProvider ], (service: BoardsProvider) => {
        expect(service instanceof Network).toBe(true);
        expect(service instanceof CachableNetwork).toBe(true);
    }));

    /**
     * testing the getUserBoards property, providing a MockBackend instance
     */
    it('should have a have a getUserBoards method', inject([ BoardsProvider, MockBackend ], (service: BoardsProvider, backend: MockBackend) => {
        expect(service.getUserBoards).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify([ {}, {} ]);
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the getStandardStream method
        service.getUserBoards(1).subscribe((boards: Boards) => {
            expect(boards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the getBoards property, providing a MockBackend instance
     */
    it('should have a have a getBoards method', inject([ BoardsProvider, MockBackend ], (service: BoardsProvider, backend: MockBackend) => {
        expect(service.getBoards).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify([ {}, {} ]);
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the getStandardStream method
        service.getBoards(1).subscribe((boards: Boards) => {
            expect(boards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));
});
