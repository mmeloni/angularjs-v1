import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { JwtHelper } from 'angular2-jwt';

import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class SessionService {
    updatedVersion: string;
    currentVersion: string;
    currentUserJwt$ = new ReplaySubject<string>(1); // Last value only, even if it's completed (BehaviourSubject doesn't send anything if it's completed)

    private storage: any;

    constructor(
        private jwtHelper: JwtHelper
    ) {
        this.storage = localStorage;
        this.updatedVersion = ConfigurationService.wayonaraVersion;
        this.currentVersion = this.storage.getItem('currentVersion');
    }

    sessionStart(authToken, userId) {
        console.warn('[DEPRECATED] SessionService.sessionStart() - Use SessionService.sessionStart$() instead');
        this.setVersionedItem('currentVersion', this.updatedVersion);
        this.storage.setItem('token', authToken);
        this.storage.setItem('userId', userId);
    }

    sessionStart$(signInData: any): Observable<number> {
        const token = signInData.token;
        const userId = signInData.data.userId;

        this.setVersionedItem('currentVersion', this.updatedVersion);
        this.setToken(token);
        return Observable.of(this.setUserId(userId));
    }

    // unused?
    checkSession() {
        const jwt = this.getToken();

        if (typeof jwt !== 'undefined' && jwt !== null && this.jwtHelper.isTokenExpired(jwt) === false) {
            this.currentUserJwt$.next(jwt);
        } else {
            this.sessionDestroy();
        }
    }

    isValidSession(): boolean {
        const jwt = this.getToken();

        return typeof jwt !== 'undefined' && jwt !== null && this.jwtHelper.isTokenExpired(jwt) === false;
    }

    sessionDestroy() {
        this.currentUserJwt$.next(null);

        this.storage.removeItem('user');
        this.storage.removeItem('token');
        this.storage.removeItem('userId');
        this.cleanVersionedItems();
    }

    // unversioned items
    getUser() {
        return JSON.parse(this.storage.getItem('user'));
    }

    setUser(user) {
        this.storage.setItem('user', JSON.stringify(user));
    }

    getToken() {
        return this.storage.getItem('token');
    }

    setToken(token: string) {
        this.storage.setItem('token', token);
    }

    getUserId() {
        return this.storage.getItem('userId');
    }

    setUserId(id: number) {
        this.storage.setItem('userId', id);
        return this.getUserId();
    }

    setCookiesAccepted(cookiesAccepted) {
        this.storage.setItem('cookiesAccepted', cookiesAccepted);
        return this.storage.getItem('cookiesAccepted');
    }

    getCookiesAccepted() {
        return this.storage.getItem('cookiesAccepted');
    }

    // versioned items
    setPreviousState(name, params) {
        this.setVersionedItem('previousState', JSON.stringify({ name: name, params: params }));
    }

    getPreviousState() {
        return this.getVersionedItem('previousState');
    }

    setBookingFormFields(bookingFormFields) {
        this.setVersionedItem('bookingFormFields', JSON.stringify(bookingFormFields));
    }

    getBookingFormFields() {
        return this.getVersionedItem('bookingFormFields');
    }

    setPaymentOrder(paymentOrder) {
        this.setVersionedItem('paymentOrder', JSON.stringify(paymentOrder));
    }

    getPaymentOrder() {
        return this.getVersionedItem('paymentOrder');
    }

    setItineraryOperation(itineraryOperation) {
        this.setVersionedItem('itineraryOperation', JSON.stringify(itineraryOperation));
    }

    getItineraryOperation() {
        return this.getVersionedItem('itineraryOperation');
    }

    private setVersionedItem(item: string, value: any) {
        if (this.updatedVersion !== this.currentVersion) {
            this.storage.setItem('currentVersion', this.updatedVersion);
            this.cleanVersionedItems();
        } else {
            return this.storage.setItem(item, value);
        }
    }

    private getVersionedItem(item: string) {
        if ((this.updatedVersion !== this.currentVersion)) {
            this.storage.setItem('currentVersion', this.updatedVersion);
            this.cleanVersionedItems();
            return null;
        } else {
            return JSON.parse(this.storage.getItem(item));
        }
    }

    private cleanVersionedItems() {
        this.storage.removeItem('searchTags');
        this.storage.removeItem('poiList');
        this.storage.removeItem('previousState');
        this.storage.removeItem('bookingFormFields');
        this.storage.removeItem('paymentOrder');
        this.storage.removeItem('itineraryOperation');
    }
}

export let sessionServiceInjectables: any[] = [ {
    provide: SessionService,
    useClass: SessionService
} ];
