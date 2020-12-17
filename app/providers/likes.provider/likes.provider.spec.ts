import { TestBed, inject } from '@angular/core/testing';
import { LikesProvider } from './likes.provider';
import { Network } from '../network/network';
import {
    HttpModule,
    Response,
    BaseRequestOptions,
    Http,
    ResponseOptions,
    RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ILikeStatus } from '../../modules/shard/types';

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
                LikesProvider // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ LikesProvider ], (service: LikesProvider) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the static headers property to exists and be valid
     */
    it('should extend Network', inject([ LikesProvider ], (service: LikesProvider) => {
        expect(service instanceof Network).toBe(true);
    }));

    /**
     * testing the toggleLike method, providing a MockBackend instance
     */
    it('should have a have a toggleLike method', inject([ LikesProvider, MockBackend ], (service: LikesProvider, backend: MockBackend) => {
        expect(service.toggleLike).toBeTruthy();

        // configure the mocked response
        backend.connections.subscribe((connection: MockConnection) => {
            const body: string = JSON.stringify({ status: true });
            const options: ResponseOptions = new ResponseOptions({ status: 200, body });
            const response: Response = new Response(options);

            // test the HTTP method
            expect(connection.request.method).toBe(RequestMethod.Post);

            // mock response
            connection.mockRespond(response);
        });

        // test the getStandardStream method
        service.toggleLike(1).subscribe((response: ILikeStatus) => {
            expect(response).toBeDefined();
            expect(response.status).toBeDefined();
            expect(response.status).toBe(true);

            backend.resolveAllConnections();
        });
    }));
});
