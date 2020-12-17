/**
 * Slider Controller.
 * @author Michele Meloni, Simone Pitzianti
*/
(function(){
    'use strict';

    angular.module('wayonara.booking').controller('SliderController', SliderController);
    SliderController.$inject = ['$scope', '$log'];

    function SliderController($scope, $log) {
        $log.debug("SliderController.init() - ", $scope);

        $scope.wnSliderModel = $scope.segment.hasOwnProperty("timeRange") ? moment( $scope.segment.timeRange.departure ).unix() : 0;
        $scope.wnSliderHigh = $scope.segment.hasOwnProperty("timeRange") ? moment( $scope.segment.timeRange.arrival ).unix() : 0;

        var floor = $scope.wnSliderModel;
        var ceil = $scope.wnSliderHigh;

        $scope.wnSlider = {
            minValue: floor,
            maxValue: ceil,
            options: {
                floor: floor,
                ceil: ceil,
                translate: function(value, sliderId, label) {
                    var depMoment = moment( floor );
                    var arrMoment = moment( ceil );
                    var depMomentDays =  depMoment.format('DDD');
                    var arrMomentDays =  arrMoment.format('DDD');
                    var shiftDays = arrMomentDays - depMomentDays;
                    var dateFormatted = moment.unix(value).format('HH:mm');
                    //only for arrival date make sense
                    if(label != "model"){
                        if(shiftDays > 0){
                            dateFormatted += '+'+shiftDays;
                        }
                    }

                    return dateFormatted;
                },
                onChange: function () {
                    $scope.onChange({attrs:{minValue: $scope.wnSlider.minValue, maxValue: $scope.wnSlider.maxValue}});
                }
            }
        };
    }
})();
