/**
 * Registration Controller.
 * @author Maurizio Vacca
 */

(function(){
    'use strict';

    angular.module('wayonara.social').controller('SubscriptionController', SubscriptionController);
    SubscriptionController.$inject = ['$scope', 'UserService', 'AuthenticationService','$log', 'TranslationService', 'translationResolved'];

    /**
     * Defines the SubscriptionController
     * @param $scope
     * @param {UserService} UserService
     * @param {AuthenticationService} AuthenticationService
     * @param $log
     * @param {TranslationService} TranslationService
     * @constructor
     */
    function SubscriptionController($scope, UserService, AuthenticationService, $log, TranslationService, translationResolved){
        $scope.registrationData = {
            email: '',
            password: '',
            username: '',
            gender: ''
        };

        $scope.translation = translationResolved;
        $scope.remoteValidation = true;

        $scope.subscribe = function(isValid){
            $log.debug("Subscription data: ");
            $log.debug($scope.registrationData);

            if(isValid === true){
                $scope.loading = true;

                //--Creates the new user
                UserService.createUser($scope.registrationData)
                        .then(function(response) {
                            //--If the result it's correct, the app redirects to the defined section
                            $scope.subscriptionStatus = $scope.translation.success;
                            AuthenticationService.sessionStart(response, 'onboarding');
                        })
                        .catch(function(error) {
                            var subscriptionEval = angular.fromJson(error._body).message;
                            $log.debug('-- SubscriptionController - catch ', subscriptionEval);
                            $scope.remoteValidation = false;
                            $scope.subscriptionStatus = $scope.translation[subscriptionEval];
                            $scope.loading = false;
                        });
            }
        };
    }
})();
