(function(){
    'use strict';

    angular.module('wayonara.social').controller('PasswordRecoveryController', PasswordRecoveryController);

    PasswordRecoveryController.$inject = ['$scope', '$state', 'AuthenticationService','UserService', 'translationResolved', '$log'];
    function PasswordRecoveryController($scope, $state, AuthenticationService, UserService, translationResolved, $log) {
        $scope.authCode = null;
        $scope.confirmPassword = null;
        $scope.translation = translationResolved;
        $scope.password = null;
        $scope.isLoading = false;

        /**
         * Password recovery
         * @param {bool} isValid form validity check
         */
        $scope.sendRecoveryEmail = function(isValid) {
            $log.debug(isValid);
            $scope.isLoading = true;

            if(isValid === true) {
                UserService.recoverPassword($scope.user)
                    .then(function(response) {
                        $log.debug('-- PasswordRecoveryController - UserService.recoverPassword response', response);
                        $scope.isLoading = false;
                        $state.go('check-code', { nid: response.nid });
                    })
                    .catch(function(response) {
                        $log.debug('-- PasswordRecoveryController - UserService.recoverPassword catch',angular.fromJson(response).message);
                        $scope.isLoading = false;
                        var result = angular.fromJson(response).message;
                        $scope.pwdResetStatus = translationResolved[result];
                    });
            }
        };

        $scope.checkRecoveryCode = function(isValid){
            $scope.isLoading = true;
            var nid = $state.params.nid;
            var authCode = $scope.authCode;

            $log.debug(nid +", " + authCode);
            $log.debug(isValid);

            if(isValid === true){
                $scope.isLoading = false;
                $state.go('new-password', { nid: nid, code: authCode});
            }
        };

        $scope.changePassword = function(isValid) {
            $scope.isLoading = true
            var nid = $state.params.nid;
            var authCode = $state.params.code;
            var password = $scope.password;

            if(isValid === true) {
                UserService.changePassword(nid, authCode, password)
                    .then(function(response) {
                        $scope.isLoading = false;
                        AuthenticationService.sessionStart(response, 'stream');
                    })
                    .catch(function(response) {
                        $log.error("An error occurred---");
                        $log.error(response);
                        $scope.isLoading = false;
                        $scope.remoteValidationError = response;
                    });
            }
        };
    }
}());
