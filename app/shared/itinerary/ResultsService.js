/**
 * Results Service.
 * @author Michele Meloni, Simone Pitzianti
 *
 * TODO: Rename
*/

(function(){
	'use strict';

	//--Declaring the factory
    angular.module('wayonara.shared').factory('ResultsService', ResultsService);

	ResultsService.$inject = ['$http', 'SessionService', '$log', 'api'];

    /**
     *
     * @param $http
     * @param {SessionService} SessionService
     * @param $log
     * @returns {{}}
     * @constructor
     */
	function ResultsService($http, SessionService, $log, api){
		var resService = {};

        /**
		 * @returns {*}
		 */
		resService.launchSearch = function(searchParams){
			var uri = api._RESULTS;
            return $http.post(uri, searchParams,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
		};

        resService.itineraryDetail = function(itineraryDetail){
            var uri = api._ITINERARY_DETAIL;
            return $http.post(uri, itineraryDetail, {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        resService.vectorsIdFromTrip = function(nextopSearchResultTrip){
            var nextopSearchResultTripModel = {};
            angular.copy(nextopSearchResultTrip, nextopSearchResultTripModel);
            var outboundVectorsList = [];

            //outbound vectors
            angular.forEach(nextopSearchResultTripModel.outboundSegment.vectors, function(outboundVector) {
                $log.debug('-- outboundVector', outboundVector);
                outboundVectorsList.push(outboundVector.id);
            });

            nextopSearchResultTripModel.outboundSegment.vectors = outboundVectorsList;
            $log.debug('-- nextopSearchResultTripModel.outboundSegment',  nextopSearchResultTripModel.outboundSegment);

            //return vectors
            if(nextopSearchResultTripModel.returnSegment){
                var returnVectorsList = [];

                angular.forEach(nextopSearchResultTripModel.returnSegment.vectors, function(returnVector) {
                    $log.debug('-- returnVector', returnVector);
                    returnVectorsList.push(returnVector.id);
                });

                nextopSearchResultTripModel.returnSegment.vectors = returnVectorsList;
                $log.debug('-- nextopSearchResultTripModel.returnSegment', nextopSearchResultTripModel.returnSegment);
            }

            return nextopSearchResultTripModel;
        };

		return resService;
	}
})();
