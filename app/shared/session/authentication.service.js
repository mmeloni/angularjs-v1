const socketMessages = require('../../web/utilities/socket.messages').socketMessages;

/**
 * Authentication Service.
 * @author Maurizio Vacca
 */

(function () {
    'use strict';

    //--Declaring the service
    angular.module('wayonara.social').service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$state', '$rootScope', '$log', 'SessionService', 'UserService', 'SocketService', 'api'];

    function AuthenticationService($http, $state, $rootScope, $log, SessionService, UserService, SocketService, api) {

        //Performs the login with the given credentials
        this.login = login;

        //Calls facebook login api
        this.facebookLogin = facebookLogin;

        //Calls instagram login api
        this.instagramLogin = instagramLogin;

        //Calls twitter login api
        this.twitterLogin = twitterLogin;

        //Checks if user is authenticated and returns token from SessionService
        this.isAuthenticated = isAuthenticated;

        //Performs user logout destroying session and redirect to login state
        this.logout = logout;

        //Initialize session for current user
        this.sessionStart = sessionStart;

        /**
         * [login description]
         * @param {String} username [username]
         * @param {String} password [user password]
         * @param {String} location [Route where to redirect user once performed login action]
         * @returns {*}
         */
        function login(username, password, location) {
            var credentials = {
                '_username': username,
                '_password': password
            };
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            return $http
                .post(api._LOGIN, credentials, { headers: headers })
                .then(function (response) {
                    var extractResponse = extractData(response);
                    $rootScope.$broadcast('WN_EVT_LOGIN_SUCCESS', {
                        response: extractResponse,
                        location: location
                    });
                })
                .catch(function (response) {
                    var extractResponse = extractData(response);
                    $rootScope.$broadcast('WN_EVT_LOGIN_FAILED', {
                        credentials: credentials,
                        response: extractResponse
                    });
                });
        };

        /**
         * [facebookLogin description]
         * @param {String} userId [Facebook User Id]
         * @param {String} token [Facebook User Token]
         * @param {String} location [Current route where is called login action]
         * @returns {httpProvider} $http
         */
        function facebookLogin(userId, token, location) {
            return $http
                .post(api._LOGIN_FACEBOOK, { 'facebookId': userId, 'facebookAccessToken': token })
                .then(function (response) {
                    var extractResponse = extractData(response);
                    $rootScope.$broadcast('WN_EVT_LOGIN_SUCCESS', {
                        response: extractResponse,
                        location: location
                    });
                })
                .catch(function (response) {
                    var extractResponse = extractData(response);
                    $rootScope.$broadcast('WN_EVT_LOGIN_FAILED', {
                        credentials: null,
                        response: extractResponse
                    });
                });
        };

        /**
         * [instagramLogin description]
         * @param {String} instagramCode [Instagram secure code to perform login]
         * @param {String} location [Current route where is called login action]
         * @returns {httpProvider} $http
         */
        function instagramLogin(instagramCode, location) {
            return $http
                .post(api._LOGIN_INSTAGRAM, { 'code': instagramCode })
                .then(function (response) {
                    $rootScope.$broadcast('WN_EVT_LOGIN_SUCCESS', {
                        response: response,
                        location: location
                    });
                })
                .catch(function (response) {
                    $rootScope.$broadcast('WN_EVT_LOGIN_FAILED', {
                        credentials: null,
                        response: response
                    });
                });
        };

        /**
         * [twitterLogin description]
         * @param  {mixed} response [Response from Twitter]
         * @param  {String} location [Current route where is called login action]
         */
        function twitterLogin(response, location) {
            this.sessionStart(response, location);
        };

        /**
         * [isAuthenticated description]
         * @returns {String} token
         */
        function isAuthenticated() {
            $log.debug('AuthenticationService.isAuthenticated() - checking session: ');
            $log.debug(SessionService);

            return SessionService.getToken() !== null;
        };

        /**
         * [logout description]
         */
        function logout() {
            //--Destroys the session data
            $log.debug('Calling sessionDestroy...');
            SessionService.sessionDestroy();

            //--Redirect the user to the landing page
            $state.go('homePublic');
        };

        /**
         * [sessionStart description]
         * @param  {mixed} response [Response from login action]
         * @param  {stream} location [Current route where is called login action]
         */
        function sessionStart(response, location) {
            $log.debug('-- authentication service - sessionStart response: ', response);

            //--Retrieves the json data
            var authToken = response.token;
            $log.debug('AuthenticationService.login() - received token: ' + authToken);

            var userId = response.data.userId;
            $log.debug('AuthenticationService.login() - received userId: ' + userId);

            //--Starts the user session
            SessionService.sessionStart(authToken, userId);
            $log.debug(SessionService);

            //--Loads the user from the API
            UserService.loadUserFullData(userId).then(function (response) {
                var userData = response;
                var user = UserService.deserialize(userData);

                SessionService.setUser(user);

                SocketService.socket.emit(socketMessages.USER_REGISTER, { nid: user.nid });

                //I have to check here for onboarding
                if (UserService.hasOnboardingWelcomeDone() === false) {
                    $state.go('onboarding');
                } else {
                    $state.go(location);
                }
            });
        };

        function extractData(response) {
            return response.data;
        }
    }
}());
