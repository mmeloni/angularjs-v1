import { TestBed, async, getTestBed } from '@angular/core/testing';

import { JwtHelper } from 'angular2-jwt';

import { ConfigurationService } from '../config/configuration.service';
import { SessionService } from './session.service';

describe('SessionService:', () => {
    let service: SessionService;

    const mockToken = 'n00b';
    const mockUserId = '12';
    const mockVersion1 = '0.7';
    const mockVersion2 = '0.8';
    const mockLocale = 'JP';
    const mockUser = { name: 'ukyo' };
    const mockPreviousState = { name: 'boo', params: [] };
    const mockBookingFormFields = { name: 'boo' };
    const mockPaymentOrder = { total: '12000' };
    const mockItineraryOperation = { trip: 'oneway' };

    const mockStorage = {
        currentVersion: mockVersion1,
        locale: mockLocale,
        poiList: [],
        token: null,
        user: JSON.stringify(mockUser),
        userId: null,
        versionedItem: null
    };

    const jwtHelperStub = {};

    beforeEach(async(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            declarations: [
                //
            ],
            imports: [
                //
            ],
            providers: [
                SessionService,
                { provide: JwtHelper, useValue: jwtHelperStub }
            ]
        });

        service = getTestBed().get(SessionService);
    }));

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof SessionService).toBe(true);
    });

    describe('Test group involving methods for not versioned items:', () => {
        it('should have sessionStart method that initializes session', async(() => {
            expect(typeof service.sessionStart).toBe('function');

            const mockSignInData = {
                data: {
                    userId: mockUserId
                },
                token: mockToken
            };
            service
                .sessionStart$(mockSignInData)
                .first()
                .subscribe((userId) => {
                    expect(localStorage.getItem('currentVersion')).not.toBeNull();
                    expect(localStorage.getItem('token')).toEqual(mockToken);
                    expect(localStorage.getItem('userId')).toEqual(userId.toString());
                });
        }));

        it('should have sessionDestroy method that destroys session and both versioned/unversioned items except permanent item', () => {
            expect(typeof service.sessionDestroy).toBe('function');

            service.sessionDestroy();

            let permanentItem = localStorage.getItem('locale');
            let versionedItem = localStorage.getItem('poiList');
            expect(permanentItem).not.toBeUndefined();
            expect(versionedItem).toBeNull();
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('userId')).toBeNull();
        });

        it('should have getUser method that retrieves user from local storage', () => {
            expect(typeof service.getUser).toBe('function');

            localStorage.setItem('user', JSON.stringify(mockUser));
            let sessionUser = service.getUser();
            expect(sessionUser.name).toEqual(mockUser.name);
        });

        it('should have setUser method that saves user in local storage', () => {
            expect(typeof service.setUser).toBe('function');

            service.setUser(mockUser);
            let sessionUser = JSON.parse(localStorage.getItem('user'));
            expect(sessionUser.name).toEqual(mockUser.name);
        });

        it('should have getToken method that retrieves user token from local storage', () => {
            expect(typeof service.getToken).toBe('function');

            localStorage.setItem('token', mockToken);
            let sessionToken = service.getToken();
            expect(sessionToken).toEqual(mockToken);
        });

        it('should have getUserId method that retrieves user id from local storage', () => {
            expect(typeof service.getUserId).toBe('function');

            localStorage.setItem('userId', mockUserId);
            let sessionUserId = service.getUserId();
            expect(sessionUserId).toEqual(mockUserId);
        });

        it('should have setCookiesAccepted method that sets choice of cookies in local storage', () => {
            expect(typeof service.setCookiesAccepted).toBe('function');

            service.setCookiesAccepted(true);
            let sessionCookiesAccepted = localStorage.getItem('cookiesAccepted');
            expect(sessionCookiesAccepted).toEqual('true');

            service.setCookiesAccepted(false);
            sessionCookiesAccepted = localStorage.getItem('cookiesAccepted');
            expect(sessionCookiesAccepted).toEqual('false');
        });
    });

    describe('Test group involving methods for versioned items:', () => {
        describe('The "setPreviousState" method:', () => {
            it('should have setPreviousState method that saves previous state in local storage if version matches', () => {
                expect(typeof service.setPreviousState).toBe('function');

                // version matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                service.setPreviousState(mockPreviousState.name, mockPreviousState.params);

                let sessionPreviousState = JSON.parse(localStorage.getItem('previousState'));
                expect(sessionPreviousState.name).toEqual(mockPreviousState.name);
            });

            it('should have setPreviousState method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.setPreviousState).toBe('function');

                // version don't matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.setPreviousState(mockPreviousState.name, mockPreviousState.params);

                let versionedItem = localStorage.getItem('previousState');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "getPreviousState" method:', () => {
            it('should have getPreviousState method that retrieves poi grid from local storage if version matches', () => {
                expect(typeof service.getPreviousState).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                localStorage.setItem('previousState', JSON.stringify(mockPreviousState));
                let sessionPreviousState = service.getPreviousState();

                expect(sessionPreviousState.name).toEqual(mockPreviousState.name);
            });

            it('should have getPreviousState method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.getPreviousState).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.getPreviousState();

                let versionedItem = localStorage.getItem('previousState');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "setBookingFormFields" method:', () => {
            it('should have setBookingFormFields method that saves booking form fields in local storage if version matches', () => {
                expect(typeof service.setBookingFormFields).toBe('function');

                // version matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                service.setBookingFormFields(mockBookingFormFields);

                let sessionBookingFormFields = JSON.parse(localStorage.getItem('bookingFormFields'));
                expect(sessionBookingFormFields.name).toEqual(mockBookingFormFields.name);
            });

            it('should have setBookingFormFields method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.setBookingFormFields).toBe('function');

                // version don't matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.setBookingFormFields(mockBookingFormFields);

                let versionedItem = localStorage.getItem('bookingFormFields');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "getBookingFormFields" method:', () => {
            it('should have getBookingFormFields method that retrieves booking form fields from local storage if version matches', () => {
                expect(typeof service.getBookingFormFields).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                localStorage.setItem('bookingFormFields', JSON.stringify(mockBookingFormFields));
                let sessionBookingFormFields = service.getBookingFormFields();

                expect(sessionBookingFormFields.name).toEqual(mockBookingFormFields.name);
            });

            it('should have getBookingFormFields method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.getBookingFormFields).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.getBookingFormFields();

                let versionedItem = localStorage.getItem('bookingFormFields');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "setPaymentOrder" method:', () => {
            it('should have setPaymentOrder method that saves payment order in local storage if version matches', () => {
                expect(typeof service.setPaymentOrder).toBe('function');

                // version matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                service.setPaymentOrder(mockPaymentOrder);

                let sessionPaymentOrder = JSON.parse(localStorage.getItem('paymentOrder'));
                expect(sessionPaymentOrder.total).toEqual(mockPaymentOrder.total);
            });

            it('should have setPaymentOrder method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.setPaymentOrder).toBe('function');

                // version don't matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.setPaymentOrder(mockPaymentOrder);

                let versionedItem = localStorage.getItem('paymentOrder');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "getPaymentOrder" method:', () => {
            it('should have getPaymentOrder method that retrieves payment order from local storage if version matches', () => {
                expect(typeof service.getPaymentOrder).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                localStorage.setItem('paymentOrder', JSON.stringify(mockPaymentOrder));
                let sessionPaymentOrder = service.getPaymentOrder();

                expect(sessionPaymentOrder.total).toEqual(mockPaymentOrder.total);
            });

            it('should have getPaymentOrder method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.getPaymentOrder).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.getPaymentOrder();

                let versionedItem = localStorage.getItem('paymentOrder');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "setItineraryOperation" method:', () => {
            it('should have setItineraryOperation method that saves itinerary operation in local storage if version matches', () => {
                expect(typeof service.setItineraryOperation).toBe('function');

                // version matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                service.setItineraryOperation(mockItineraryOperation);

                let sessionItineraryOperation = JSON.parse(localStorage.getItem('itineraryOperation'));
                expect(sessionItineraryOperation.trip).toEqual(mockItineraryOperation.trip);
            });

            it('should have setItineraryOperation method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.setItineraryOperation).toBe('function');

                // version don't matches
                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.setItineraryOperation(mockItineraryOperation);

                let versionedItem = localStorage.getItem('itineraryOperation');
                expect(versionedItem).toBeNull();
            });
        });

        describe('The "getItineraryOperation" method:', () => {
            it('should have getItineraryOperation method that retrieves itinerary operation from local storage if version matches', () => {
                expect(typeof service.getItineraryOperation).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion1;

                localStorage.setItem('itineraryOperation', JSON.stringify(mockItineraryOperation));
                let sessionItineraryOperation = service.getItineraryOperation();

                expect(sessionItineraryOperation.trip).toEqual(mockItineraryOperation.trip);
            });

            it('should have getItineraryOperation method that clean versioned items in local storage if version do not matches', () => {
                expect(typeof service.getItineraryOperation).toBe('function');

                service.currentVersion = mockVersion1;
                service.updatedVersion = mockVersion2;

                service.getItineraryOperation();

                let versionedItem = localStorage.getItem('itineraryOperation');
                expect(versionedItem).toBeNull();
            });
        });
    });
});
