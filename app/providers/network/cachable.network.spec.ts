import { inject, TestBed } from '@angular/core/testing';
import { CachableNetwork } from './cachable.network';
import { HttpModule } from '@angular/http';
import { Network } from './network';
import { ProviderCache } from './cache';

interface MockedType {
    id: number;
    string: string;
}

describe('CachableNetwork provider', () => {
    /**
     * create the TestBed configuration providing the service provider to be tested
     */
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CachableNetwork // the provider to be tested
            ],
            imports: [ HttpModule ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ CachableNetwork ], (service: CachableNetwork<MockedType>) => {
        expect(service).toBeTruthy();
    }));

    /**
     * The service should extend Network
     */
    it('should extend Network', inject([ CachableNetwork ], (service: CachableNetwork<MockedType>) => {
        expect(service instanceof Network).toBe(true);
    }));

    /**
     * The service should have a cache
     */
    it('should extend Network', inject([ CachableNetwork ], (service: CachableNetwork<MockedType>) => {
        expect(service.cache).toBeDefined();
        expect(service.cache instanceof ProviderCache).toBe(true);
    }));
});
