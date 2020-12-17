/**
 * Application routing
 * @author Maurizio Vacca
 */

import { Transition } from 'ui-router-ng2';
import { UserService } from './shared/user/user.service';
import { AttractionAndPlaceViewComponent } from './web/place/attraction-and-place-view/attraction-and-place-view.component';

import { translationResolved } from './app.route-resolves';
import { stateHotel } from './web/hotel/hotel-routes';
import { stateOnboardingSetup, stateOnboardingWelcome } from './web/onboarding/onboarding-routes';
import {
    stateHomePublic,
    statePasswordRecovery,
    statePasswordRecoveryCodeCheck,
    statePasswordRecoveryNewPassword,
    stateSignIn,
    stateSignUp
} from './web/public-site/public-site-routes';

// the following pages should be rendered server side:
import { streamRoute } from './modules/+stream';
import { profileRoutes } from './modules/+profile';
import { profileEdit } from './modules/+profile.edit';

declare let angular: any;

(function () {
    'use strict';

    angular.module('wayonara.web').config(config).run(run);

    // --Configure the application (routing)
    config.$inject = [ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$logProvider', '$localStorageProvider', 'constants', 'api' ];

    function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $logProvider, $localStorageProvider, constants, api) {
        // --Log configuration
        $logProvider.debugEnabled(constants._DEBUG_ENABLED);

        // --Pretty URL
        // $locationProvider.html5Mode(true);

        $localStorageProvider.setKeyPrefix('wayonara-');

        // --Routing
        $urlRouterProvider.otherwise('/');
        // $httpProvider.interceptors.push('HttpInterceptor');

        $stateProvider
            .state(stateHomePublic)
            .state(stateSignIn)
            .state(stateSignUp)
            .state(statePasswordRecovery)
            .state(statePasswordRecoveryCodeCheck)
            .state(statePasswordRecoveryNewPassword)
            // stream page:
            .state(streamRoute)
            // profile edit page:
            .state(profileEdit)
            // profile page:
            // .state(profileRoutes.profileRoute)
            .state(profileRoutes.profileByUserNidRoute)
            .state(profileRoutes.profileDetailByViewType)
            // old profile:
            /*.state('profile', {
                abstract: true,
                controller: function ($scope, $log, target, translationResolved) {
                    $scope.target = target;
                    $log.debug('-- profile route target', $scope.target);
                    $scope.translation = translationResolved;
                },
                resolve: {
                    loadCountries: loadCountries,
                    loadTranslationLabels: loadTranslationLabels,
                    target: function (UserService, $stateParams, $log) {
                        let targetId = $stateParams.userId;
                        return UserService.loadUserFullData(targetId).then(function (response) {
                            return UserService.deserialize(response);
                        });
                    },
                    translatedCountriesResolved: translatedCountriesResolved,
                    translationResolved: translationResolvedNg1
                },
                templateUrl: 'web/profile/profile.html',
                url: '/profile',
                volatile: true
            })
            .state('profile.create', {
                controller: 'ProfileController',
                templateUrl: 'web/profile/create-profile.html',
                url: '/create'
            })*/
            // Home is a special "roleplay" state, currently being impersonated by 'stream', which is a real state
            .state('home', {
                redirectTo: 'stream'
            })
            .state('logout', {
                controller: function (AuthenticationService) {
                    AuthenticationService.signOut();
                },
                template: ' ',
                url: '/logout'
            })
            // TODO: Refactor merging it back into state `stream`
            .state('search', {
                controller: 'StreamController',
                navbar: true,
                resolve: {
                    loadTranslationLabels: loadTranslationLabels,
                    shardsResolved: function ($stateParams, ShardService) {
                        return ShardService.getShards($stateParams.text, 1).then(
                            function (response) {
                                return response.data.shards;
                            }
                        );
                    },
                    translationResolved: translationResolvedNg1
                },
                templateUrl: 'web/stream/stream.template.html',
                url: '/search?text'
            })
            .state('instagram-login', {
                controller: function (code) {
                    let igService = window.opener.$service;

                    if (code !== undefined) {
                        igService.deferred.resolve(code);
                        window.close();
                    } else {
                        igService.deferred.reject('Invalid code');
                        window.close();
                    }
                },
                data: {
                    public: true
                },
                resolve: {
                    code: function ($stateParams) {
                        return { code: $stateParams.code };
                    }
                },
                url: '/social/instagram_login?code'
            })
            .state('twitter-login', {
                controller: function ($log, params) {
                    $log.debug(params);
                    let oauth_token = params.oauth_token;
                    let oauth_verifier = params.oauth_verifier;

                    let twService = window.opener.$service;

                    if ((oauth_token !== undefined) && (oauth_verifier !== undefined)) {
                        twService.deferred.resolve(params);
                        window.close();
                    } else {
                        twService.deferred.reject('Invalid oauth token');
                        window.close();
                    }

                },
                data: {
                    public: true
                },
                resolve: {
                    params: function ($stateParams) {
                        return { oauth_token: $stateParams.t, oauth_verifier: $stateParams.v };
                    }
                },
                url: '/social/twitter_login?t={oauth_token}&v={oauth_verifier}'
            })
            // TO-DO: WHEN NG1->NG2 ROUTERING PROBLEMS ARE FIXED, POINT TO 'SHARDS' STATE
            // https://github.com/ui-router/ng1-to-ng2/issues/28
            // https://github.com/ui-router/ng1-to-ng2/issues/27
            .state('shards', {
                controller: function (shard, $state) {
                    switch (shard.bit) {
                        case constants._SHARD_BIT_MASK.attraction:
                            // NOTE: attraction component doesn't exists, is used place component
                            $state.go('shards.attraction', { placeId: shard.id });
                            break;
                        case constants._SHARD_BIT_MASK.hotel:
                            $state.go('shards.hotel', { hotelId: shard.id });
                            break;
                        case constants._SHARD_BIT_MASK.place:
                            $state.go('shards.place', { placeId: shard.id });
                            break;
                        case constants._SHARD_BIT_MASK.tour:
                            $state.go('tour.view', { tourId: shard.id });
                            break;
                        default:
                            break;
                    }
                },
                resolve: {
                    shard: function ($stateParams, ShardService, $state, $log) {
                        $log.debug('Resolving ...', $state);
                        return ShardService.getShardById($stateParams.shardId).then(function (response) {
                            return response.data;
                        });
                    }
                },
                url: '/shards/:shardId',
                volatile: true
            })

            .state({
                name: 'stage',
                onEnter: function (ShardService, ModalService, UserService, $transition$) {
                    const shardId = $transition$.params().shardId;
                    ShardService.getShardById(shardId).then((response) => {
                        ModalService.openShardDetail(response.data, UserService.getUser());
                    }).catch((error) => {
                        //
                    });
                },
                resolve: [
                    translationResolved
                ],
                url: '/shards/:shardId/stage'
            })

            // TO-DO: WHEN NG1->NG2 ROUTERING PROBLEMS ARE FIXED, POINT TO 'SHARDS' STATE
            // https://github.com/ui-router/ng1-to-ng2/issues/28
            // https://github.com/ui-router/ng1-to-ng2/issues/27

            // TODO: actually attraction component doesn't exists, use place component instead. If needed, create attraction component
            // START NG1->NG2 CHILD ROUTES

            // NOTE: attraction component doesn't exists, is used place component
            .state('shards.attraction', {
                redirectTo: { state: 'attraction', params: { placeId: this } }
            })
            .state({
                component: AttractionAndPlaceViewComponent,
                name: 'attraction',
                resolve: [
                    translationResolved
                ],
                url: '/shards/:placeId/attraction'
            })

            .state('shards.hotel', {
                redirectTo: { state: 'hotel', params: { hotelId: this } }
            })
            .state(stateHotel)
            .state('shards.place', {
                redirectTo: { state: 'place', params: { placeId: this } }
            })
            .state({
                component: AttractionAndPlaceViewComponent,
                name: 'place',
                resolve: [
                    translationResolved
                ],
                url: '/shards/:placeId/place'
            })
            // END NG1->NG2 CHILD ROUTES
            .state('tour', {
                navbar: true,
                resolve: {
                    loadTranslationLabels: loadTranslationLabels,
                    tourResolved: function (TourService, $stateParams, $log) {
                        return TourService.getTourById($stateParams.tourId).then(
                            function (response) {
                                $log.debug('tour tourResolved', response);
                                return response.data;
                            },
                            function (error) {
                                $log.error('tour tourResolved', error);
                            }
                        );
                    },
                    translationResolved: translationResolvedNg1
                },
                templateUrl: 'web/tour/tour.html',
                url: '/tour/:tourId'
            })
            .state('tour.view', {
                controller: 'TourViewController',
                controllerAs: 'vmTourView',
                navbar: true,
                templateUrl: 'web/tour/view/view.html',
                url: '/view'
            })
            .state('tour.edit-presentation', {
                controller: 'TourPresentationController',
                navbar: true,
                templateUrl: 'web/tour/presentation/presentation.html',
                url: '/edit/presentation'
            })
            .state('tour.edit', {
                abstract: true,
                controller: 'TourEditorController',
                navbar: true,
                templateUrl: 'web/tour/edit/edit.html',
                url: '/edit'
            })
            .state('tour.edit.plan', {
                controller: function ($scope, tourResolved) {
                    $scope.tourResolved = tourResolved;
                },
                navbar: true,
                templateUrl: 'web/tour/edit/planner.html',
                url: '/plan'
            })
            .state('tour.edit.quote', {
                controller: 'TourQuoteController',
                controllerAs: 'vmTQC',
                navbar: true,
                resolve: {
                    arrival: function ($stateParams, tourResolved) {
                        return tourResolved.timeline[ parseInt($stateParams.index, 10) + 1 ].model;
                    },

                    departure: function ($stateParams, tourResolved) {
                        return tourResolved.timeline[ parseInt($stateParams.index, 10) - 1 ].model;
                    },

                    oneWayQuoted: function ($stateParams, $log, tourResolved, TourService) {
                        tourResolved.timeline = TourService.roundtripAnalysis(tourResolved.timeline, $stateParams.index);
                        let oneWayQuoted = TourService.findOnewayQuoted(tourResolved.timeline, $stateParams.index);
                        return oneWayQuoted;
                    }
                },
                templateUrl: 'web/tour/quote/quote.html',
                url: '/quote/:index'
            })
            .state('tour.edit.selected', {
                controller: 'ResultsEditSelectedController',
                controllerAs: 'vmRES',
                navbar: true,
                reload: true,
                templateUrl: 'web/results/selected.html',
                url: '/selected/:index'
            })
            .state('tour.booking', {
                abstract: true,
                controller: function ($scope, $log, tourResolved) {
                    $scope.tour = tourResolved;
                    $scope.breadcrumbs = [];
                    $log.debug('--- state tour.booking - tour: ', $scope.tour);
                },
                navbar: true,
                templateUrl: 'web/tour/booking/booking.html',
                url: '/booking'
            })
            .state('tour.booking.recap', {
                controller: 'TourRecapController',
                controllerAs: 'vmTRC',
                navbar: true,
                params: {
                    itineraryOperation: null,
                    paymentOrder: null
                },
                reload: true,
                resolve: {
                    PO_IO: function (TourBookingService, $stateParams, tourResolved, SessionService) {
                        const processPrice = fare_offer => {
                            fare_offer['price'] = 0;
                            fare_offer.price += +fare_offer.net_fare;
                            fare_offer.price += +fare_offer.markup;
                            fare_offer.price += +fare_offer.reseller_markup;
                            fare_offer.price = Math.round(fare_offer.price*100)/100;
                            return fare_offer;
                        };
                        const processRules = fare_offer => {
                            if (fare_offer.fare_rules) {
                                fare_offer.fare_rules = angular.fromJson(fare_offer.fare_rules);
                            } else {
                                fare_offer = [];
                            }
                            return fare_offer;
                        };
                        const processFareOffer = fare_offer => {
                            fare_offer = processPrice(fare_offer);
                            fare_offer = processRules(fare_offer);
                            return fare_offer;
                        };
                        const processVector = vector => {
                            if (vector.fare_offers) {
                                vector.fare_offers = vector.fare_offers.map(processFareOffer);
                            } 
                            return vector;
                        };
                        const processBookingTravel = bookingTravel => {
                            if (bookingTravel.nextopSearchResultTrip.outboundSegment.vectors) {
                                bookingTravel.nextopSearchResultTrip.outboundSegment.vectors = bookingTravel.nextopSearchResultTrip.outboundSegment.vectors.map(processVector);
                            }
                            return bookingTravel;
                        };
                        const processPaymentOrder = (paymentOrder) => {
                            if (paymentOrder.paymentOrder.bookingTravel) {
                                paymentOrder.paymentOrder.bookingTravel = paymentOrder.paymentOrder.bookingTravel.map(processBookingTravel);
                            }
                            return paymentOrder;
                        }

                        let paymentOrderItineraryOperation = {
                            paymentOrder: null,
                            itineraryOperation: null
                        };

                        // Se non ho il payment order nei parametri di stato richiamo l'API del TourBookingService
                        let paramPaymentOrderNotAvailable = (typeof $stateParams.paymentOrder !== 'undefined' && $stateParams.paymentOrder !== null) ? false : true;
                        let paramItineraryOperationNotAvailable = (typeof $stateParams.itineraryOperation !== 'undefined' && $stateParams.itineraryOperation !== null) ? false : true;

                        // Se uno dei due parametri non è disponibile faccio la chiamata
                        if (paramPaymentOrderNotAvailable || paramItineraryOperationNotAvailable) {
                            // CERCO IN SESSIONE PRIMA DI FARE QUALSIASI OPERAZIONE
                            let sessionPaymentOrder = SessionService.getPaymentOrder();
                            let sessionItineraryOperation = SessionService.getItineraryOperation();

                            if ((typeof sessionPaymentOrder === 'undefined' || sessionPaymentOrder === null) || (typeof sessionItineraryOperation === 'undefined' || sessionItineraryOperation === null)) {
                                return TourBookingService.fillPaymentOrderAndItineraryOnRecap(tourResolved).then(
                                    function (response) {
                                        paymentOrderItineraryOperation.paymentOrder = response.paymentOrder;
                                        paymentOrderItineraryOperation.itineraryOperation = response.itineraryOperation;

                                        // METTO IN SESSIONE
                                        SessionService.setPaymentOrder(response.paymentOrder);
                                        SessionService.setItineraryOperation(response.itineraryOperation);

                                        return processPaymentOrder(paymentOrderItineraryOperation);
                                    }
                                );
                            } else {
                                // RECUPERO DALLA SESSIONE E RESTITUISCO
                                paymentOrderItineraryOperation.paymentOrder = sessionPaymentOrder;
                                paymentOrderItineraryOperation.itineraryOperation = sessionItineraryOperation;

                                return processPaymentOrder(paymentOrderItineraryOperation);
                            }
                        } else {
                            paymentOrderItineraryOperation.paymentOrder = $stateParams.paymentOrder;
                            paymentOrderItineraryOperation.itineraryOperation = $stateParams.itineraryOperation;

                            // METTO IN SESSIONE
                            SessionService.setPaymentOrder($stateParams.paymentOrder);
                            SessionService.setItineraryOperation($stateParams.itineraryOperation);

                            return processPaymentOrder(paymentOrderItineraryOperation);
                        }
                    }
                },
                templateUrl: 'web/tour/booking/booking-recap.html',
                url: '/recap'

            })
            .state('tour.booking.form', {
                controller: 'TourBookingFormController',
                navbar: true,
                params: {
                    bookingFormFields: null,
                    itineraryOperation: null,
                    paymentOrder: null
                },
                resolve: {
                    PO_IO_BFF: function (TourBookingService, $stateParams, $log, tourResolved, SessionService) {

                        let paymentOrderItineraryOperationbookingFormFields = {
                            paymentOrder: null,
                            itineraryOperation: null,
                            bookingFormFields: null
                        };

                        // Se non ho il payment order nei parametri di stato richiamo l'API del TourBookingService
                        let bookingFormFieldsNotAvailable = (typeof($stateParams.bookingFormFields) !== 'undefined' && $stateParams.bookingFormFields !== null) ? false : true;
                        let paymentOrderNotAvailable = (typeof($stateParams.paymentOrder) !== 'undefined' && $stateParams.paymentOrder !== null) ? false : true;
                        let itineraryOperationNotAvailable = (typeof($stateParams.itineraryOperation) !== 'undefined' && $stateParams.itineraryOperation !== null) ? false : true;

                        // Se uno dei due parametri non è disponibile faccio la chiamata
                        if (bookingFormFieldsNotAvailable || paymentOrderNotAvailable || itineraryOperationNotAvailable) {

                            // CERCO IN SESSIONE PRIMA DI FARE QUALSIASI OPERAZIONE
                            let sessionPaymentOrder = SessionService.getPaymentOrder();
                            let sessionItineraryOperation = SessionService.getItineraryOperation();
                            let sessionBookingFormFields = SessionService.getBookingFormFields();

                            // Se ho l'itinerary
                            if ((typeof(sessionPaymentOrder) === 'undefined' || sessionPaymentOrder === null) || (typeof(sessionItineraryOperation) === 'undefined' || sessionItineraryOperation === null) || (typeof(sessionBookingFormFields) === 'undefined' || sessionBookingFormFields === null)) {
                                // Sto ricaricando con F5 quindi devo ricavarmi anche l'itineraryOperation
                                return TourBookingService.fillPaymentOrderAndItineraryOnRecap(tourResolved).then(
                                    function (response) {
                                        let paymentOrder = response.paymentOrder;
                                        let itineraryOperation = response.itineraryOperation;

                                        paymentOrderItineraryOperationbookingFormFields.itineraryOperation = response.itineraryOperation;

                                        return TourBookingService.retrieveBookingRequirements(itineraryOperation)
                                            .then(function (response) {
                                                let bookingFormFields = response.data.bookingFormFields;
                                                let paymentOrder = response.data.paymentOrder;

                                                paymentOrderItineraryOperationbookingFormFields.bookingFormFields = response.data.bookingFormFields;
                                                paymentOrderItineraryOperationbookingFormFields.paymentOrder = response.data.paymentOrder;

                                                SessionService.setPaymentOrder(paymentOrder);
                                                SessionService.setItineraryOperation(itineraryOperation);
                                                SessionService.setBookingFormFields(bookingFormFields);

                                                return paymentOrderItineraryOperationbookingFormFields;

                                            })
                                            .catch(function (response) {
                                                $log.debug('error api retrieve booking form');
                                            });
                                    }
                                );
                            } else {
                                paymentOrderItineraryOperationbookingFormFields.bookingFormFields = sessionBookingFormFields;
                                paymentOrderItineraryOperationbookingFormFields.paymentOrder = sessionPaymentOrder;
                                paymentOrderItineraryOperationbookingFormFields.itineraryOperation = sessionItineraryOperation;

                                return paymentOrderItineraryOperationbookingFormFields;
                            }
                        } else {
                            paymentOrderItineraryOperationbookingFormFields.bookingFormFields = $stateParams.bookingFormFields;
                            paymentOrderItineraryOperationbookingFormFields.paymentOrder = $stateParams.paymentOrder;
                            paymentOrderItineraryOperationbookingFormFields.itineraryOperation = $stateParams.itineraryOperation;

                            SessionService.setPaymentOrder($stateParams.paymentOrder);
                            SessionService.setBookingFormFields($stateParams.bookingFormFields);
                            SessionService.setItineraryOperation($stateParams.itineraryOperation);

                            return paymentOrderItineraryOperationbookingFormFields;
                        }
                    },
                    loadCountries: loadCountries,
                    translatedCountriesResolved: translatedCountriesResolved
                },
                templateUrl: 'web/tour/booking/booking-form.html',
                url: '/form'
            })
            .state('tour.booking.confirm', {
                controller: 'TourConfirmController',
                controllerAs: 'vmTCC',
                navbar: true,
                params: {
                    itineraryOperation: null,
                    paymentOrder: null
                },
                resolve: {
                    PO_IO: function ($stateParams, tourResolved, SessionService) {
                        let paymentOrderItineraryOperation = {
                            paymentOrder: null,
                            itineraryOperation: null
                        };

                        let paymentOrderNotAvailable = (typeof($stateParams.paymentOrder) !== 'undefined' && $stateParams.paymentOrder !== null) ? false : true;
                        let itineraryOperationNotAvailable = (typeof($stateParams.itineraryOperation) !== 'undefined' && $stateParams.itineraryOperation !== null) ? false : true;

                        if (paymentOrderNotAvailable || itineraryOperationNotAvailable) {
                            let sessionPaymentOrder = SessionService.getPaymentOrder();
                            let sessionItineraryOperation = SessionService.getItineraryOperation();

                            paymentOrderItineraryOperation.paymentOrder = sessionPaymentOrder;
                            paymentOrderItineraryOperation.itineraryOperation = sessionItineraryOperation;

                            return paymentOrderItineraryOperation;
                        } else {
                            paymentOrderItineraryOperation.paymentOrder = $stateParams.paymentOrder;
                            paymentOrderItineraryOperation.itineraryOperation = $stateParams.itineraryOperation;

                            return paymentOrderItineraryOperation;
                        }
                    }
                },
                templateUrl: 'web/tour/booking/booking-confirm.html',
                url: '/confirm'
            })
            .state('error', {
                navbar: true,
                templateUrl: 'web/error/index.html',
                url: '/error'
            })
            .state('board', {
                abstract: true,
                controller: function (translationResolved) {
                    var vm = this;
                    vm.translation = translationResolved;
                },
                controllerAs: 'vmBoard',
                navbar: true,
                resolve: {
                    board: function (BoardService, $stateParams) {
                        return BoardService.getBoardById($stateParams.boardId, 1, 20).then(function (response) {
                            return response.data;
                        });
                    },
                    loadTranslationLabels: loadTranslationLabels,
                    translationResolved: translationResolvedNg1
                },
                templateUrl: 'web/board/board.html',
                url: '/board/:boardId'
            })
            .state('board.view', {
                controller: 'BoardViewController',
                navbar: true,
                templateUrl: 'web/board/view/view.html',
                url: '/view'
            })
            .state('board.edit', {
                controller: 'BoardEditController',
                navbar: true,
                templateUrl: 'web/board/edit/edit.html',
                url: '/edit'
            })
            // Onboarding
            .state(stateOnboardingWelcome)
            .state(stateOnboardingSetup)
            .state('settings', {
                abstract: true,
                controller: 'SettingsController',
                navbar: true,
                resolve: {
                    loadTranslationLabels: loadTranslationLabels,
                    translationResolved: translationResolvedNg1,
                    userResolved: function (UserService) {
                        return UserService.getUser();
                    }
                },
                templateUrl: 'web/settings/setting.html',
                url: '/settings'
            })
            .state('settings.mybookings', {
                controller: 'SettingsMyBookingsController',
                navbar: true,
                templateUrl: 'web/settings/sections/my-bookings.html',
                url: '/mybookings'
            })
            .state('settings.mybookingDetails', {
                controller: 'SettingsMyBookingsDetailsController',
                navbar: true,
                resolve: {
                    bookingDetails: function (TourBookingService, $stateParams) {
                        return TourBookingService.retrieveBookingDetail($stateParams.fullBookingPreviewId)
                            .then(function (response) {
                                return response.data;
                            })
                            .catch(function (response) {
                                return null;
                            });
                    },
                    myBooking: function ($stateParams) {
                        return $stateParams.myBooking;
                    }
                },
                templateUrl: 'web/settings/sections/my-booking-details.html',
                url: '/mybookings/details/:fullBookingPreviewId'
            });
    }

    // --Run the application
    run.$inject = [ '$rootScope', '$log', '$state', '$injector', 'constants', '$timeout', '$transitions' ];

    function run($rootScope, $log, $state, $injector, constants, $timeout, $transitions) {
        $log.debug('Running module...');
        let self = $rootScope;

        $timeout(function () {
            const sessionService = $injector.get('SessionService');
            const authenticationService = $injector.get('AuthenticationService');
            const loadingStateService = $injector.get('LoadingStateService');
            const userService = $injector.get('UserService');

            sessionService.currentUserJwt$.subscribe((jwt) => {
                let toState = 'homePublic';

                if (jwt !== undefined && jwt !== null) {
                    toState = 'home';
                    if (userService.hasOnboardingWelcomeDone() === false) {
                        toState = 'onboarding';
                    }
                }

                $state.go(toState);
            });

            $transitions.onBefore({}, (transition: Transition) => {
                const fromState = transition.from();
                const toState = transition.to();
                const redirectTo = toState.redirectTo;
                self.appView = toState.name.replace(new RegExp('\\.', 'g'), '-'); // legacy

                $rootScope.$broadcast('WN_EVT_PAGELOADING'); // legacy
                // might need to also check fromParams and toParams
                // might need to also check redirection (try toState.data, because .redirectTo performs an actual redirection)
                if (toState.name !== fromState.name) {
                    loadingStateService.startLoading();
                }
            });

            const matchAuthenticationRequired = {
                to: (state) => {
                    return state.data === null || state.data === undefined || state.data.public !== true;
                }
            };
            $transitions.onBefore(matchAuthenticationRequired, (transition: Transition) => {
                return authenticationService.isAuthenticated();
            });

            // Legacy: volatile and unnamed states should be implemented differently with Angular UI Router
            const matchToSetPreviousState = {
                from: (state) => {
                    return (state.data === null || state.data === undefined || state.data.volatile !== true);
                }
            };
            $transitions.onBefore(matchToSetPreviousState, (transition: Transition) => {
                sessionService.setPreviousState(transition.from().name, transition.from().params);
            });

            $transitions.onSuccess({}, (transition: Transition) => {
                $rootScope.$broadcast('WN_EVT_PAGELOADED'); // legacy
                loadingStateService.stopLoading();
            });

            $transitions.onError({}, (transition: Transition) => {
                $rootScope.$broadcast('WN_EVT_PAGELOADED'); // legacy
                loadingStateService.stopLoading();
            });
        }, 0);
    }

    function loadTranslationLabels(TranslationService, $log) {
        return TranslationService.loadTranslationLabels().then(function (response) {
            $log.debug('loadTranslationLabels', response);
            return response;
        }).catch(function (error) {
            $log.error('loadTranslationLabels', error);
            return undefined;
        });
    }

    function translationResolvedNg1(TranslationService, loadTranslationLabels, $log) {
        let translation = TranslationService.getTranslationLabels();
        $log.debug('translationResolved', translation);
        return translation;
    }

    function loadCountries(TranslationService) {
        return TranslationService.loadCountries().then(function (response) {
            return response;
        }).catch(function (error) {
            return undefined;
        });
    }

    function translatedCountriesResolved(TranslationService, loadCountries, $log) {
        let countries = TranslationService.getTranslatedCountries();
        $log.debug('translatedCountries', countries);
        return countries;
    }

}());
