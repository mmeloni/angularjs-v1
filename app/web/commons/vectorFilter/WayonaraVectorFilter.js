(function(){
	'use strict';

	angular.module('wayonara.tour').directive('wnVectorFilter', WayonaraVectorFilter);
	WayonaraVectorFilter.$inject = ['$log', 'constants'];

	function WayonaraVectorFilter($log, constants){
		return {
			restrict:'EA',
			replace: true,
			templateUrl: 'web/commons/vectorFilter/vector-filter.html',
			scope:{
				availableVectorBm: "=", //vectors present in current results
                wnVectorFilterModel: "=", //active filters
                enabledFiltersBm: "=", //timeline node bit
                activeVectorFilter: '&'
			},
			controller: function($scope, $log, $rootScope){
                $scope.availableVectorArray = [];
                /**
                 * Here start loop to draw filter.
                 */
                for(var vector in constants._VECTORS_BIT_MASK){
                    if(constants._VECTORS_BIT_MASK[vector] == constants._VECTORS_BIT_MASK.ancillarystore){
                        continue;
                    }
                    /**
                     * Here we check if a vector is present in all vector bitmask. If present we draw a filter.
                     * We can have multibit vector type.Ex trains are composed by TI bit 0x00000002 and SNFC one 0x00004000.
                     * 'train' label is 0x00004002.
                     * Update on 11/07/2018 now train is C002 (added amadeus ti train)
                     * Update on 29/11/2018 now train is 0x0001C400 (added amadeus merchant train)
                     * To display a filter is enough '&' to check if at least 1 bit is active,as follow. -> (constants._VECTORS_BIT_MASK[vector] & $scope.availableVectorBm) > 0
                     */
                    if((constants._VECTORS_BIT_MASK[vector] & $scope.availableVectorBm) > 0){
                        var vectorObj = {};
                        vectorObj.bit = constants._VECTORS_BIT_MASK[vector];
                        vectorObj.label = vector;
                        /**
                         * Here we decide if a filter has to be activate or deactivate -> ($scope.enabledFiltersBm == constants._VECTORS_BIT_MASK[vector] )
                         * We have to mantain previus filter selected by user -> ((constants._VECTORS_BIT_MASK[vector] | ~$scope.wnVectorFilterModel) == ~$scope.wnVectorFilterModel)
                         * In this way if user change date and launch again a search filters are mantained.
                         */
                        if(($scope.enabledFiltersBm == constants._VECTORS_BIT_MASK[vector] ) ||
                           ((constants._VECTORS_BIT_MASK[vector] | ~$scope.wnVectorFilterModel) == ~$scope.wnVectorFilterModel) ){
                            vectorObj.active = true;
                        }else{
                            vectorObj.active = false;
                        }
                        $scope.availableVectorArray.push(vectorObj);
                    }

                }

                $scope.activeVectorFilter = function(vector){
                    $scope.wnVectorFilterModel ^= vector.bit;
                    vector.active ? vector.active = false: vector.active = true;
                }
			},
			link: function(scope, element){

			}
		}
	}
})();
