import { TestBed, inject } from '@angular/core/testing';
import { Network } from './network';
import {
    HttpModule, RequestOptions, Headers, Response, BaseRequestOptions,
    Http, ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('Network provider', () => {

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
                    useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backendInstance, defaultOptions),
                },
                Network // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ Network ], (service: Network) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the static headers property to exists and be valid
     */
    it('should have a valid headers property', () => {
        const headers = Network.headers;

        expect(headers).toBeTruthy();
        expect(headers instanceof Headers).toBe(true);

        expect(headers.get('Accept')).toBeTruthy();
        expect(typeof headers.get('Accept')).toBe('string');

        expect(headers.get('Content-Type')).toBeTruthy();
        expect(typeof headers.get('Content-Type')).toBe('string');

        expect(headers.get('X-Requested-With')).toBeTruthy();
        expect(typeof headers.get('X-Requested-With')).toBe('string');
    });

    /**
     * testing the standardRequestOptions property
     */
    it('should have a valid standardRequestOptions property', inject([ Network ], (service: Network) => {
        const standardRequestOptions = service.standardRequestOptions;

        expect(standardRequestOptions).toBeTruthy();
        expect(standardRequestOptions instanceof RequestOptions).toBeTruthy();

        expect(standardRequestOptions.headers).toBeTruthy();
        expect(standardRequestOptions.headers instanceof Headers).toBeTruthy();
    }));

    /**
     * testing the serializeResponse method
     */
    it('should have a have a serializeResponse method', inject([ Network ], (service: Network) => {
        const body: string = JSON.stringify({ hello: 'world' });
        const options: ResponseOptions = new ResponseOptions({ status: 200, body });
        const response: Response = new Response(options);

        expect(service.serializeResponse).toBeTruthy();
        expect(service.serializeResponse(response)).toBeTruthy();
        expect(service.serializeResponse(response) instanceof Object).toBe(true);
    }));

    /**
     * testing the setAuthToken method
     */
    it('should have a have a setAuthToken method that return an instance of Headers', () => {
        const token: string = 'mocked-token';

        expect(Network.setAuthToken).toBeTruthy();
        expect(Network.setAuthToken(token)).toBeTruthy();
        expect(Network.setAuthToken(token) instanceof Headers).toBe(true);
    });

    /**
     * testing the GET property, providing a MockBackend instance
     */
    it('should have a have a get method', inject([ Network, MockBackend ], (service: Network, backend: MockBackend) => {
        expect(service.get).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ hello: 'world' });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Get);

            // mock response
            connection.mockRespond(response);
        });

        // test the get method
        service.get('/exampleUrl').subscribe((response) => {
            expect(response instanceof Response).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the POST property, providing a MockBackend instance
     */
    it('should have a have a post method', inject([ Network, MockBackend ], (service: Network, backend: MockBackend) => {
        expect(service.get).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ post: 'hello world' });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the post method
        service.post('/exampleUrl', { hello: 'world' }).subscribe((response) => {
            expect(response instanceof Response).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the DELETE method, providing a MockBackend instance
     */
    it('should have a have a delete method', inject([ Network, MockBackend ], (service: Network, backend: MockBackend) => {
        expect(service.get).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ deleted: true });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Delete);

            // mock response
            connection.mockRespond(response);
        });

        // test the post method
        service.delete('/exampleUrl').subscribe((response) => {
            expect(response instanceof Response).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the PUT method, providing a MockBackend instance
     */
    it('should have a have a put method', inject([ Network, MockBackend ], (service: Network, backend: MockBackend) => {
        expect(service.get).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ deleted: true });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Put);

            // mock response
            connection.mockRespond(response);
        });

        // test the post method
        service.put('/exampleUrl', { hello: 'world' }).subscribe((response) => {
            expect(response instanceof Response).toBe(true);

            backend.resolveAllConnections();
        });
    }));
});
