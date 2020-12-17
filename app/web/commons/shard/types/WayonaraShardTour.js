(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnShardTour', WayonaraShardTour);
    WayonaraShardTour.$inject = ['$log', 'TranslationService'];

    /**
     * $log
     * {TranslationService} TranslationService
     */
    function WayonaraShardTour($log, TranslationService){
        var config = {
            restrict: 'EA',
            templateUrl : 'web/commons/shard/types/shard-tour.html',
            replace: true,
            controller: 'ShardTourController',
            scope: true,
            link: function(scope, element){

                $log.debug(scope);

                dynamizer(element, scope);
                //--Animations
                //animatePoi(scope.shard, element);
                animateSocialActions(element);

                $(element).imagesLoaded(function(){
                    scope.gridManager.appended(element);
                    scope.gridManager.layout();
                    $(element).addClass("active");
                });
            }
        };

        /**
         * Dynamic shard size
         */
        var dynamizer = function(element, scope) {
            var randomSize = Math.floor(Math.random() * 100);
            var classSize = "";
            if(randomSize >= 0 && randomSize <1) {
                //--large (_triple_shard_)
                classSize = "lg";
                scope.imgFormat = "_triple_shard_";
            }
            else if(randomSize>=1 && randomSize<10){
                //--medium (_double_shard_)
                classSize = "md";
                scope.imgFormat = "_double_shard_";
            }
            else {
                //-small (_single_shard_)
                classSize = "sm";
                scope.imgFormat = "_single_shard_";
            }

            //--Forces all shards to small
            //classSize = "sm";

            //--Test stretching
            //classSize = "lg";
            //scope.imgFormat = "_triple_shard_";

            element.addClass(classSize);
        };


        /**
         * Remove when SURE
         */
        var animateSocialActions = function(element){}

        return config;
    }
})();
