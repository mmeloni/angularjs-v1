/**
 * StateProvider is an extensible base provider that exposes methods for set and get
 * local state through a private Observable<T>.
 * It is intended not to be used or injected directly into components
 * but should be extended from other providers in order to archive code reuse
 * and avoid providers to re-implements common used methods
 */

import { merge } from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class StateProvider<T> {

    /**
     * the initialState of type T
     */
    private initialState: T;

    /**
     * The original Observable<T> subject
     */
    private subject: BehaviorSubject<T>;

    /**
     * When created a StateProvider should initialize the initialState and the subject properties
     * @param {T} initialState
     */
    constructor(initialState: T) {
        this.initialState = initialState;
        this.subject = new BehaviorSubject<T>(initialState);
    }

    /**
     * return the Observable of the local state
     * @returns {Observable<T>}
     */
    public getState(): Observable<T> {
        return this.subject.distinctUntilChanged();
    }

    /**
     * Create and set a new state from a Partial of type T
     * @param {Partial<T>} newState
     * @returns {T}
     */
    public setState(newState: Partial<T>): T {
        const currentState = this.subject.getValue();
        const nextState = merge({}, currentState, newState);

        this.subject.next(nextState);

        return nextState;
    }

    /**
     * reset the local subject to the initial state
     * @returns {Observable<T>}
     */
    public reset(): T {
        this.subject.next(this.initialState);

        return this.initialState;
    }

    /**
     * clear the local subject
     */
    public clear(): void {
        this.subject.next(null);
    }
}
