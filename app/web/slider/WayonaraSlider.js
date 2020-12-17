/**
 */

(function(){
    'use strict';

    angular.module('wayonara.booking').directive('wnSlider', WayonaraSlider);
    WayonaraSlider.$inject = ['$log'];

    function WayonaraSlider($log) {

        var config = {
            restrict: 'EA',
            templateUrl: 'web/slider/Slider.html',
            replace: true,
            controller: 'SliderController',
            scope: {
                segment: '=',
                wnSliderModel: '=',
                wnSliderHigh: '=',
                onChange: '&'
            }
        };
        return config;
    }
})();
