(function() {
    'use strict';

    angular.module('wayonara.commons').controller('ModalWindowLoginController', ModalWindowLoginController);

    ModalWindowLoginController.$inject = ['$scope', '$log', '$document', '$state', 'TranslationService', 'FacebookService', 'TwitterService', 'InstagramService', 'AuthenticationService', 'constants'];
    function ModalWindowLoginController($scope, $log, $document, $state, TranslationService, FacebookService, TwitterService, InstagramService, AuthenticationService, constants) {
        $scope.remoteValidation = true;
        $scope.translation = TranslationService.getTranslationLabels();
        $scope.isLoadingFacebook = false;
        $scope.isLoading = false;

        $scope.boot = function() {
            $scope.open($scope.$modal);
            var $background = $('.app-wrapper');
            TweenLite.set($background, { css: { className: '+=blurred-bg' } });

            var $loginPane = $scope.$modal.find('.login-pane-wrapper');

            $loginPane.on('click', function(e) {
                closeModalFull($scope.$modal, $loginPane);
            }).children().on('click', function(e) {
                e.stopPropagation();
            });

            $document.on('keyup', function(e) {
                if (e.which === 27) {
                    $scope.$emit('modal.login.escClose');
                }
            }).find('.login-pane-wrapper').on('keyup', function(e) {
                e.stopPropagation();
            });
        };

        var escCloseCancel;
        if (angular.isUndefined(escCloseCancel)) {
            escCloseCancel = $scope.$on('modal.login.escClose', function(event) {
                closeModalFull($scope.$modal, $document);
                escCloseCancel();
            });
        }

        $scope.$on('$stateChangeStart', function() {
            $scope.close($scope.$modal);
        });

        $scope.restoreAppState = function() {
            var $background = $('.app-wrapper');
            TweenLite.set($background, { css: { className: '-=blurred-bg' } });
        };

        /* Init social plugins */
        $scope.$on('$viewContentLoaded', function() {
            TwitterService.init();
            FacebookService.init();
            InstagramService.init();
        });

        $scope.login = function(isValid) {
            if (isValid) {
                $scope.isLoading = true;
                AuthenticationService.login($scope.username, $scope.password, 'stream').then(
                    function() {}
                ).catch(
                    function() {
                        $scope.formLogin.$invalid = false;
                    }
                );
            }
        };

        /**
         * Facebook Login Method.
         */
        $scope.facebookLogin = function() {
            $scope.isLoadingFacebook = true;
            FacebookService.login()
                .then(function(response) {
                    $log.debug('-- modal window login controller - $scope.facebookLogin - FacebookService.login response', response);

                    //--Call the backend API
                    AuthenticationService.facebookLogin(response.authResponse.userID, response.authResponse.accessToken, 'stream')
                                        .then(function(response) {
                                                $log.debug('-- modal window login controller - $scope.facebookLogin - response', response);
                                            })
                                        .catch(function(response) {
                                            $log.debug('-- modal window login controller - $scope.facebookLogin - catch', response);
                                            $scope.isLoadingFacebook = false;
                                        });

                });
        };

        $scope.facebookSignup = function() {
            var result = FacebookService.signup();
            $log.debug('-- modal window login controller - $scope.facebookSignup - result', result);
        };

        $scope.instagramLogin = function() {
            //freezed waiting to plan refactoring
            /*
            var popupWidth = constants._SOCIALS.instagram.popupSize.width;
            var popupHeight = constants._SOCIALS.instagram.popupSize.height;

            InstagramService.openLoginDialog(popupWidth, popupHeight)
                .then(function (response) {
                    $log.debug(response);
                    InstagramService.setCode(response.code);
                    AuthenticationService.instagramLogin(InstagramService.getCode(),'stream');
                })
                .catch(function(response) {
                    $log.debug(response);
                });
            */
        };

        $scope.twitterLogin = function() {
            //freezed waiting to plan refactoring
            /*
            var popupWidth = constants._SOCIALS.twitter.popupSize.width;
            var popupHeight = constants._SOCIALS.twitter.popupSize.height;

            TwitterService.openLoginDialog(popupWidth, popupHeight)
                .then(function(response) {
                    $log.debug(response);
                    TwitterService.apiTwitterLogin(response).then(function(response) {
                        $log.debug('twitterResponse', response);
                        AuthenticationService.twitterLogin(response, 'stream');
                    });
                })
                .catch(function(response) {
                    $log.debug(response);
                });
            */
        };

        function closeModalFull(modal, element) {
            $log.debug('WayonaraModalWindow - closing the modal...', element);
            $scope.$parent.showLoginButton();
            $scope.close(modal);
        }

        $scope.$on('WN_EVT_LOGIN_FAILED', function(event, args){
            $log.debug('-- modal-window-login.controller.js - WN_EVT_LOGIN_FAILED - an error occurred trying to login: ');
            var jsonData = angular.fromJson(args.response);
            var loginEval = jsonData.message;

            $log.debug('-- modal-window-login.controller.js - WN_EVT_LOGIN_FAILED - credentials',args.credentials);
            $log.debug('-- modal-window-login.controller.js - WN_EVT_LOGIN_FAILED - jsonData',jsonData);
            $log.debug('-- modal-window-login.controller.js - WN_EVT_LOGIN_FAILED - loginEval',loginEval);

            $scope.remoteValidation = false;
            $scope.loginStatus = $scope.translation[loginEval];
            $scope.isLoading = false;
            $scope.isLoadingFacebook = false;
            $scope.formLogin.$invalid = false;

            $state.go('login');
        });
    }
}());
