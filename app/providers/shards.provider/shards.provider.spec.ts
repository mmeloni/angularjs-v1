import { TestBed, inject } from '@angular/core/testing';
import { ShardsProvider } from './shards.provider';
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
import { Shards } from '../../modules/shard/types';

describe('ShardsProvider', () => {

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
                ShardsProvider // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ ShardsProvider ], (service: ShardsProvider) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the inheritance of the provider, it could inherit from Network and CachableNetwork
     */
    it('should extend Network and CachedNetwork', inject([ ShardsProvider ], (service: ShardsProvider) => {
        expect(service instanceof Network).toBe(true);
        expect(service instanceof CachableNetwork).toBe(true);
    }));

    /**
     * testing the getStandardStream property, providing a MockBackend instance
     */
    it('should have a have a getStandardStream method', inject([ ShardsProvider, MockBackend ], (service: ShardsProvider, backend: MockBackend) => {
        expect(service.getStandardStream).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ user: null, shards: [] });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Get);

            // mock response
            connection.mockRespond(response);
        });

        // test the getStandardStream method
        service.getStandardStream(1).subscribe((shards: Shards) => {
            expect(shards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the getStageShards property, providing a MockBackend instance
     */
    it('should have a have a getStageShards method', inject([ ShardsProvider, MockBackend ], (service: ShardsProvider, backend: MockBackend) => {
        expect(service.getStageShards).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ user: null, shards: [] });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the getStageShards method
        service.getStageShards(1, 1).subscribe((shards: Shards) => {
            expect(shards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the getBoardsShards method, providing a MockBackend instance
     */
    it('should have a have a getBoardsShards method', inject([ ShardsProvider, MockBackend ], (service: ShardsProvider, backend: MockBackend) => {
        // FIXME: write the test for this method
    }));

    /**
     * testing the getToursShards method, providing a MockBackend instance
     */
    it('should have a have a getToursShards method', inject([ ShardsProvider, MockBackend ], (service: ShardsProvider, backend: MockBackend) => {
        expect(service.getToursShards).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ user: null, shards: [] });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the getToursShards method
        service.getToursShards(1, 1).subscribe((shards: Shards) => {
            expect(shards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));

    /**
     * testing the getToursShards method, providing a MockBackend instance
     */
    it('should have a have a getShardsByStreamType method', inject([ ShardsProvider, MockBackend ], (service: ShardsProvider, backend: MockBackend) => {
        expect(service.getShardsByStreamType).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ user: null, shards: [] });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // mock response
            connection.mockRespond(response);
        });

        // test the getShardsByStreamType method
        service.getShardsByStreamType('stream').subscribe((shards: Shards) => {
            expect(shards instanceof Array).toBe(true);

            backend.resolveAllConnections();
        });
    }));
});
