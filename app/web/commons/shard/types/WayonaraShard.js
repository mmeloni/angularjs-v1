(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnShard', WayonaraShard);
    WayonaraShard.$inject = ['$log','$compile'];

    /**
     * $log
     * {TranslationService} TranslationService
     */
    function WayonaraShard($log, $compile){
        var config = {
            restrict: 'EA',
            replace: true,
            scope: {gridManager: '=', ngModel: '='},
            link: function(scope, element){
                var $shard = null;
                scope.shard = scope.ngModel;

                //Renderizzo la giusta direttiva a seconda del tipo di shard
                switch(scope.ngModel.bit) {
                    //Shard Stage, Shard Attraction
                    case 2:
                    case 128:
                        var $shardStage = '<wn-shard-stage grid-manager=scope.gridManager shard=shard></wn-shard-stage>';
                        element.html($shardStage);
                        $shard = $compile(element.contents())(scope);
                        break;
                    //Shard Tour
                    case 8:
                        var $shardTour = '<wn-shard-tour grid-manager=scope.gridManager shard=shard></wn-shard-tour>';
                        element.html($shardTour);
                        $shard = $compile(element.contents())(scope);
                        break;
                }

                element.replaceWith($shard);
            }
        };


        return config;
    }
})();

(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnShardStage', WayonaraShardStage);
    WayonaraShardStage.$inject = ['$log', 'TranslationService'];

    /**
     * $log
     * {TranslationService} TranslationService
     */
    function WayonaraShardStage($log, TranslationService){
        var config = {
            restrict: 'EA',
            templateUrl : 'web/commons/shard/types/shard-stage.html',
            replace: true,
            controller: 'ShardController',
            scope: true,
            link: function(scope, element){

                $log.debug("Inside WayonaraShardStage");
                $log.debug(scope.gridManager);
                $log.debug(scope.shard);

                dynamizer(element, scope);
                //--Animations
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
         * REMOVE WHEN SURE
         */
        var animateSocialActions = function(element){
        };

        return config;
    }
})();

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
         * TO DELETE WHEN SURE
         */
        var animateSocialActions = function(element){

        }

        return config;
    }
})();
