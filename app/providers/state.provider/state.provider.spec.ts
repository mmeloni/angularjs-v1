import { TestBed, inject } from '@angular/core/testing';
import { StateProvider } from './state.provider';
import { Observable } from 'rxjs/Observable';

describe('StateProvider provider', () => {

    interface TestState {
        flag: boolean;
        aString: string;
    }

    const initialState: TestState = { flag: true, aString: 'hello world' };

    class StateProviderTest extends StateProvider<TestState> {
        constructor() {
            super(initialState);
        }
    }

    /**
     * create the TestBed configuration providing a backend infrastructure
     * and the service provider to be tested
     */
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StateProviderTest // the provider to be tested
            ]
        });
    });

    /**
     * The service should initialize properly
     */
    it('should be created', inject([ StateProviderTest ], (service: StateProviderTest) => {
        expect(service).toBeTruthy();
    }));

    /**
     * testing the getState method
     */
    it('should have a getState method that return an observable of state', inject([ StateProviderTest ], (service: StateProviderTest) => {
        expect(service.getState).toBeTruthy();

        const state = service.getState();
        expect(state instanceof Observable).toBe(true);
    }));

    /**
     * testing the getState method
     */
    it('should have a setState method that trigger a change into the state', inject([ StateProviderTest ], (service: StateProviderTest) => {
        expect(service.getState).toBeTruthy();

        // change the state
        service.setState({ flag: false, aString: 'hello test' });

        service.getState().subscribe((state: TestState) => {
            expect(state.flag).toBe(false);
            expect(state.aString).toBe('hello test');
        });
    }));

    /**
     * testing the setState with a partial of the state type
     */
    it('should take a variable that is a Partial type of the state type as a parameter and return the whole state',
        inject([ StateProviderTest ], (service: StateProviderTest) => {
            // change the state
            service.setState({ aString: 'NEW STRING' });

            service.getState().subscribe((state: TestState) => {
                expect(typeof state.flag).toBe('boolean');
                expect(typeof state.aString).toBe('string');
                expect(state.aString).toBe('NEW STRING');
            });
        }));

    /**
     * testing the getState method
     */
    it('should have a reset method that set the state to the initial state', inject([ StateProviderTest ], (service: StateProviderTest) => {
        expect(service.getState).toBeTruthy();

        // reset the state
        service.reset();

        service.getState().subscribe((state: TestState) => {
            expect(state).toEqual(initialState);
        });
    }));
});
