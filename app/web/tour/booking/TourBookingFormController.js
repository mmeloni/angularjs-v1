(function(){
    'use strict';

    angular.module('wayonara.tour').controller('TourBookingFormController', TourBookingFormController);

    TourBookingFormController.$inject = ['$scope', '$state', '$rootScope', '$log', '$window', 'translationResolved', 'translatedCountriesResolved', 'SessionService', 'TourBookingService', 'PO_IO_BFF', 'constants'];
    /**
     * Tour booking Controller
     *
     * @param $scope
     * @param $log
     */
    function TourBookingFormController($scope, $state, $rootScope, $log, $window, translationResolved, translatedCountriesResolved, SessionService, TourBookingService, PO_IO_BFF, constants){

        $scope.enteringRecap = false;

        $scope.checkInvoice = false;

        $scope.translation = translationResolved;
        $state.current.breadcrumbs = [
                {
                    label: translationResolved.recap
                },
                {
                    label: translationResolved.booking
                }
            ];

        $window.Stripe.setPublishableKey(constants._STRIPE_PUBLISHABLE_KEY);

        $scope.errorMessage = null;
        $scope.stripeErrorMessage = null;
        $scope.stripeError = false;
	    $scope.paymentStarted = false;

        $scope.bookingForm = {};
        $scope.creditCardsAccepted = constants._CREDIT_CARDS_ACCEPTED;
        $scope.translatedCountries = translatedCountriesResolved;
        $log.debug('-- translated countries', translatedCountriesResolved);

        $scope.bookingFormFields = PO_IO_BFF.bookingFormFields;
        $scope.paymentOrder = PO_IO_BFF.paymentOrder;
        $scope.itineraryOperation = PO_IO_BFF.itineraryOperation;

        $scope.stripeCallback = function (code, result) {
        	$scope.paymentStarted = true;
            if (result.error) {
                $scope.stripeError = true;
                $scope.stripeErrorMessage = 'Error Payment: '+ result.error.message;
                $log.debug('stripe failed!code:', code, $scope.stripeErrorMessage);
	            $scope.paymentStarted = false;
            } else {
                $log.debug('stripe success! token: ',result.id);
                $scope.stripeError = false;
                $scope.stripeErrorMessage = null;
                $scope.bookingForm.payment.stripeToken = result.id;
                if($scope.bookingForm.$valid){
                    $scope.bookItinerary($scope.bookingForm, $scope.bookingForm.$valid);
                }
            }
        };

        $scope.bookItinerary = function(isValid){
            $log.debug('--- BOOKING FORM MODEL', $scope.bookingForm);
            $log.debug('--- isValid',isValid);

            //bookingForm.payment.cardholderName validation
            var cardholderNameCheck = $scope.bookingForm.payment.cardholderName.split(' ');
            if(cardholderNameCheck.length <= 1){
                $scope.stripeError = true;
                $scope.stripeErrorMessage = 'Error Payment: Please Fill Cardholder Name Field with your full name';
                $log.debug('stripe failed!cardholderName:', $scope.bookingForm.payment.cardholderName, $scope.stripeErrorMessage);
	            $scope.paymentStarted = false;
            } else {
                $rootScope.$broadcast('WN_EVT_PAGELOADING');

                $scope.processFormData();

                TourBookingService.itineraryBooking($scope.itineraryOperation)
                    .then(function(response){

                        $log.debug('--- book itinerary - put payment order in session',response.data);
                        SessionService.setPaymentOrder(response.data);
                        $log.debug('--- book itinerary - put itinerary operation in session',$scope.itineraryOperation);
                        SessionService.setItineraryOperation($scope.itineraryOperation);

                        $rootScope.$broadcast('WN_EVT_PAGELOADED');

                        $state.go('tour.booking.confirm',{'paymentOrder': response.data, 'itineraryOperation': $scope.itineraryOperation});
                        $log.debug('--- book itinerary - Payment Order Booked', response.data);
                    })
                    .catch(function(response){
                        $rootScope.$broadcast('WN_EVT_PAGELOADED');
                        $log.debug('error api itineraryBooking', response);
                        $state.go('error', {'paymentOrder': response.data});
                    });
            }
        };

        $scope.processFormData = function(){
            var customer = {
                address:'',
                city:'',
                emailAddress:'',
                country:'',
                phoneNumber:'',
                firstName:'',
                lastName:'',
                zipCode:''
            };

            var invoiceData = {
                businessName: '',
                firstName: '',
                lastName: '',
                vat: '',
                emailAddress: '',
                address: '',
                city: '',
                zipCode: '',
                country: ''
            }
            $scope.itineraryOperation.travelers = [];

            //passengers form
            angular.forEach($scope.bookingForm.passenger, function(passengerFormData, keyPassenger) {
                var traveler = {
                    firstName:'',
                    lastName:'',
                    patronymic:'',
                    sex:'',
                    age:'',
                    dateOfBirth:'',
                    country:'',
                    document:'',
                    documentNumber:'',
                    documentEmissionDate:'' ,
                    documentExpirationDate:'',
                    countryIssue:'',
                    keyCode:'',
                    number:''
                };
                traveler.firstName = passengerFormData.firstName;
                traveler.lastName = passengerFormData.lastName;
                traveler.patronymic = passengerFormData.patronymic;
                traveler.sex = passengerFormData.passengerGender;
                traveler.age = typeof($scope.bookingFormFields.passengers[Object.keys($scope.bookingFormFields.passengers)[keyPassenger]].age) !== 'undefined' ? $scope.bookingFormFields.passengers[Object.keys($scope.bookingFormFields.passengers)[keyPassenger]].age : null;
                traveler.dateOfBirth = passengerFormData.dateOfBirth;
                traveler.country = passengerFormData.country;
                //optional fields (only in flights): fix document data needed only for intercontinental flights
                traveler.document = passengerFormData.documentType;
                traveler.documentNumber = passengerFormData.documentNumber;
                traveler.documentEmissionDate = passengerFormData.emissionDate;
                traveler.documentExpirationDate = passengerFormData.expirationDate;
                traveler.countryIssue = passengerFormData.countryIssue;
                //end of optional fields (only in flights)
                traveler.keyCode = keyPassenger + '_' + traveler.age;
                traveler.number = keyPassenger;

                $scope.itineraryOperation.travelers.push(traveler);

            });

            //customer form
            customer.address = $scope.bookingForm.customer.address;
            customer.emailAddress = $scope.bookingForm.customer.email;
            customer.country = $scope.bookingForm.customer.nation;
            customer.phoneNumber = $scope.bookingForm.customer.phonePrefix + ' ' +$scope.bookingForm.customer.phoneNumber;
            var customerFullName = $scope.bookingForm.payment.cardholderName.split(' ');
            //explode $scope.bookingForm.payment.cardholderName
            customer.firstName = customerFullName[0];
            customer.lastName = customerFullName[1];
            customer.zipCode = $scope.bookingForm.customer.zipCode;
            customer.city = $scope.bookingForm.customer.city;
            $scope.itineraryOperation.customer = customer;

            if(angular.isDefined($scope.bookingForm.invoiceDetails)){
                invoiceData.businessName = $scope.bookingForm.invoiceDetails.businessName;
                invoiceData.firstName = $scope.bookingForm.invoiceDetails.firstName;
                invoiceData.lastName = $scope.bookingForm.invoiceDetails.lastName;
                invoiceData.vat = $scope.bookingForm.invoiceDetails.vat;
                invoiceData.emailAddress = $scope.bookingForm.invoiceDetails.email;
                invoiceData.address = $scope.bookingForm.invoiceDetails.address;
                invoiceData.city = $scope.bookingForm.invoiceDetails.city;
                invoiceData.zipCode = $scope.bookingForm.invoiceDetails.zipCode;
                invoiceData.country = $scope.bookingForm.invoiceDetails.nation;
                $scope.itineraryOperation.invoiceData = invoiceData;
            }

            $scope.itineraryOperation.paymentGatewayToken = $scope.bookingForm.payment.stripeToken;

            $scope.itineraryOperation.status = constants._ITINERARY_OPERATION_ENUM.BOOKING_PAYMENT;

            $log.debug('--- $scope.itineraryOperation UPDATED', $scope.itineraryOperation);
        };
    }
})();
