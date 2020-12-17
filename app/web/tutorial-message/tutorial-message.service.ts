import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TutorialMessageServiceOptions } from './tutorial-message-service-options.model';
import { TutorialMessageState } from './tutorial-message-state.model';

@Injectable()
export class TutorialMessageService {
    private stateSource: BehaviorSubject<TutorialMessageState>;
    private messageSource: Subject<string>;
    private isLockedSource: BehaviorSubject<boolean>;

    state$: Observable<TutorialMessageState>;
    stateDefault: TutorialMessageState = new TutorialMessageState();
    message$: Observable<any>;
    isLocked$: Observable<any>;
    isLockedDefault: boolean = false;

    constructor() {
        // Observable sources
        this.stateSource = new BehaviorSubject<TutorialMessageState>(this.stateDefault);
        this.messageSource = new Subject<string>();
        this.isLockedSource = new BehaviorSubject<boolean>(this.isLockedDefault);

        // Observable streams
        this.state$ = this.stateSource.asObservable();
        this.message$ = this.messageSource.asObservable();
        this.isLocked$ = this.isLockedSource.asObservable();
    }

    // Service message commands
    showTutorialMessage(options?: TutorialMessageServiceOptions) {
        let callback;
        if (options !== undefined) {
            if (options.message !== undefined) { this.setMessage(options.message); };
            callback = options.callback;
        }

        this.stateSource.next({state: 'in', callback: callback});
    }

    hideTutorialMessage(options?: TutorialMessageServiceOptions) {
        let callback;
        if (options !== undefined) {
            callback = options.callback;
        }

        this.stateSource.next({state: 'out', callback: callback});
    }

    animationStart(event) {
        if (event.fromState !== 'void') {
            this.isLockedSource.next(true);
        }
    }

    animationDone(event, callback) {
        if (event.fromState !== 'void') {
            this.isLockedSource.next(false);
            if (callback !== undefined) {
                callback();
            }
        }
    }

    setMessage(newMessage: string) {
        this.messageSource.next(newMessage);
    }
}
