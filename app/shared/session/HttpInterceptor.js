/**
 * Http Interceptor
 */

(function(){
	'use strict';

	angular.module('wayonara.shared').factory('HttpInterceptor', HttpInterceptor);
	HttpInterceptor.$inject = ['$q', '$injector', '$log'];

	/**
	 * Define the HttpInterceptor
	 * @param $injector
	 * @param $log
	 * @constructor
	 */
	function HttpInterceptor($q, $injector, $log) {
		$log.debug("HttpInterceptor - Http request catched...");

		return {
			"response": function(response){
				return response || $q.when(response);
			},
			"responseError": function(rejection){
				if(rejection.status === 401){
					var state = $injector.get('$state');
					$log.debug("HttpInterceptor.responseError - ", state);

					if(state.current.public !== true) {
						state.transitionTo('logout');
					}
				}

				return $q.reject(rejection);
			}
		};
	}
})();
