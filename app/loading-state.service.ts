import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoadingStateService {
    private isLoadingSource: BehaviorSubject<boolean>;

    isLoading$: Observable<boolean>;

    constructor() {
        this.isLoadingSource = new BehaviorSubject(false);
        this.isLoading$ = this.isLoadingSource.asObservable();
    }

    startLoading() {
        this.isLoadingSource.next(true);
    }

    stopLoading() {
        this.isLoadingSource.next(false);
    }
}
