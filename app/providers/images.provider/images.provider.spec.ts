import { TestBed, inject } from '@angular/core/testing';
import { ImagesProvider } from './images.provider';
import { Network } from '../network';
import { CachableNetwork } from '../network';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('ImagesProvider', () => {

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
                ImagesProvider // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the inheritance of the provider, it could inherit from Network and CachableNetwork
     */
    it('should extend Network and CachedNetwork', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service instanceof Network).toBe(true);
        expect(service instanceof CachableNetwork).toBe(true);
    }));

    /**
     * testing the getUserAvatar method
     */
    it('should have a have a getUserAvatar method', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service.getUserAvatar).toBeTruthy();

        // test the getUserAvatar method
        service.getUserAvatar(1).subscribe((imageUrl: string) => {
            expect(typeof imageUrl).toBe('string');
        });
    }));

    /**
     * testing the getShardItemBackground method
     */
    it('should have a have a getShardItemBackground method', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service.getShardItemBackground).toBeTruthy();

        // test the getShardItemBackground method
        service.getShardItemBackground(1).subscribe((imageUrl: string) => {
            expect(typeof imageUrl).toBe('string');
        });
    }));

    /**
     * testing the getUserCover method
     */
    it('should have a have a getUserCover method', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service.getUserCover).toBeTruthy();

        // test the getUserCover method
        service.getUserCover(1).subscribe((imageUrl: string) => {
            expect(typeof imageUrl).toBe('string');
        });
    }));

    /**
     * testing the getUserAvatar method
     */
    it('should have a have a getUserAvatar method', inject([ ImagesProvider ], (service: ImagesProvider) => {
        expect(service.getUserAvatar).toBeTruthy();

        // test the getUserAvatar method
        service.getUserAvatar(1).subscribe((imageUrl: string) => {
            expect(typeof imageUrl).toBe('string');
        });
    }));
});
